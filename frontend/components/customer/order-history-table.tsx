import { OrderSummaryResponse } from "@/lib/definitions";
import { formatCurrency } from "@/lib/utils";

interface OrderHistoryTableProps {
  orderSummary: OrderSummaryResponse;
}

export default function OrderHistoryTable({
  orderSummary,
}: OrderHistoryTableProps) {
  return (
    <div className="w-full overflow-hidden">
      <table className="w-full table-fixed text-left border-collapse">
        <thead>
          <tr className="border-b border-light-gray text-deep-brown text-sm">
            <th className="w-[30%] py-3 px-2 font-bold">메뉴명</th>
            <th className="w-[25%] py-3 px-2 font-bold text-right whitespace-nowrap">
              가격
            </th>
            <th className="w-[20%] py-3 px-2 font-bold text-center whitespace-nowrap">
              수량
            </th>
            <th className="w-[25%] py-3 px-2 font-bold text-right whitespace-nowrap">
              총액
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-light-gray/50">
          {orderSummary.orderItems.map((item, index) => (
            <tr
              key={`${item.menuName}-${index}`}
              className="text-black text-sm"
            >
              <td className="py-4 px-2 break-keep">
                <span className="font-medium text-black leading-tight ">
                  {item.menuName}
                  {item.selectedOption && (
                    <>
                      <br />
                      <span className="text-xs">({item.selectedOption})</span>
                    </>
                  )}
                </span>
              </td>
              <td className="py-4 px-2 text-right whitespace-nowrap">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="py-4 px-2 text-center text-sepia whitespace-nowrap">
                x {item.totalQuantity}
              </td>
              <td className="py-4 px-2 text-right font-bold whitespace-nowrap">
                {formatCurrency(item.unitPrice * item.totalQuantity)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-pale-gray/30 border-t border-sepia/20">
            <td
              colSpan={2}
              className="py-4 px-2 text-right font-bold text-deep-brown"
            >
              합계
            </td>
            <td
              colSpan={2}
              className="py-4 px-2 text-right font-black text-cinnamon text-lg whitespace-nowrap"
            >
              {formatCurrency(orderSummary.totalAmount)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
