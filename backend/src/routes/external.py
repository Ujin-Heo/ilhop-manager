from fastapi import APIRouter, HTTPException, Request, status, Depends
from sqlalchemy.exc import NoResultFound, MultipleResultsFound
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.models import get_db
from ..schemas.rest_schemas import PaymentConfirmInfo, OrderPaymentUpdateResponse
from ..schemas.ws_schemas import PaymentConfirmedMessage
from ..database.crud import compare_payment_info_with_db
from ..modules.websocket_manager import manager

router = APIRouter()


@router.post(
    "/external/confirm-payment",
    operation_id="confirm_payment",
    status_code=status.HTTP_200_OK,
    tags=["external"],
    summary="MacroDroid가 입금 확인을 알릴 때 사용함",
)
async def confirm_payment(
    request: Request,
    request_data: PaymentConfirmInfo,
    db: AsyncSession = Depends(get_db),
):
    """
    총무의 핸드폰으로 토스 입금 알림이 오면, 핸드폰에 설치된 MacroDroid 앱이\n
    `PaymentConfirmInfo` 형식의 request body를 담은 request를 백엔드로 보냄
    """

    try:
        client_host = request.client.host
        print(
            f"[📍 /external/confirm-payment로 요청 보낸 기기의 IP 주소: {client_host} ]"
        )

        # data = request_data.model_dump_json()
        # with open("bank_webhook_request_body.txt", "w", encoding="utf-8") as f:
        #     f.write(data)

        order_id = await compare_payment_info_with_db(db, request_data)

        # Pydantic 모델을 사용하여 데이터 조립
        message = PaymentConfirmedMessage(
            data=OrderPaymentUpdateResponse(orderId=order_id, isPaid=True)
        )

        # 모델의 데이터를 딕셔너리로 변환하여 전송
        await manager.send_to_customer(order_id, message.model_dump())
        await manager.broadcast_to_admins(message.model_dump())

    except NoResultFound as nrfe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"[❌ 해당 주문을 찾을 수 없음] {str(nrfe)}",
        )
    except MultipleResultsFound as nrfe:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"[⚠️ 해당 조건을 만족하는 주문이 여러 개 존재함] 수동으로 입금 확인이 필요합니다. {str(nrfe)}",
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"[❌ 잘못된 요청] {str(ve)}",
        )
    except Exception as e:  # 서버 내부 에러
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"[⚠️ 서버 오류] {str(e)}",
        )
