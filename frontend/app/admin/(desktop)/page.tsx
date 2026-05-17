import { getMetadata } from "@/lib/api/metadata";

export default async function Page() {
  let title = "그루터기 일일호프";
  try {
    const meta = await getMetadata();
    if (meta && meta.title) {
      title = meta.title;
    }
  } catch (error) {
    console.error("Failed to fetch metadata for admin page:", error);
  }

  return (
    <main className="p-8 bg-warm-beige min-h-screen text-deep-brown">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b border-sepia pb-6">
          <h1 className="text-4xl font-bold mb-4 text-cinnamon">
            {title} 관리자 가이드
          </h1>
          <p className="text-lg opacity-80">
            {title} 관리자 페이지 사용 안내 페이지입니다.
          </p>
        </header>

        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-cinnamon flex items-center justify-center text-white font-bold text-lg">
              1
            </div>
            <h2 className="text-2xl font-bold">테이블 현황</h2>
          </div>
          <div className="ml-14 p-6 bg-white rounded-2xl shadow-sm border border-sepia/20">
            <p className="leading-relaxed">
              입장 안내 담당이 사용합니다. 테이블 배치를 수정하고, 손님의
              입장/퇴장을 관리하는 페이지입니다.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-cinnamon flex items-center justify-center text-white font-bold text-lg">
              2
            </div>
            <h2 className="text-2xl font-bold">주문 현황</h2>
          </div>
          <div className="ml-14 p-6 bg-white rounded-2xl shadow-sm border border-sepia/20 space-y-4">
            <p className="leading-relaxed">
              카운터 담당이 사용합니다. 주문이 들어오면 화면에 주문 내역이
              표시됩니다.
            </p>
            <ul className="list-disc ml-5 space-y-3 opacity-90">
              <li>
                입금 확인되면 해당 주문 행의 배경이{" "}
                <span className="font-semibold text-charcoal">흰색</span>으로
                변합니다. 총무의 스마트폰에 설치한 MacroDroid를 통해 자동으로
                입금이 확인되거나,{" "}
                <span className="text-blue font-medium underline underline-offset-4 decoration-blue/30">
                  &quot;입금 여부&quot;
                </span>
                란을 클릭하여 수동으로 입금을 확인할 수 있습니다.
              </li>
              <li>
                서빙이 완료된 메뉴는{" "}
                <span className="text-green font-bold">초록색</span>으로
                표시됩니다. 서빙 담당자 화면에서 특정 메뉴를 서빙 완료로
                표시하면 카운터 담당자의 주문 현황 화면에도 반영됩니다. 카운터
                담장자가 직접 클릭해서 서빙 완료상태로 바꿀 수도 있습니다.
              </li>
              <li>
                <span className="text-sepia font-medium underline underline-offset-4 decoration-sepia/30">
                  &quot;비고&quot;
                </span>
                란을 클릭하여 메모를 남길 수 있습니다.
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-cinnamon flex items-center justify-center text-white font-bold text-lg">
              3
            </div>
            <h2 className="text-2xl font-bold">설정</h2>
          </div>
          <div className="ml-14 p-6 bg-white rounded-2xl shadow-sm border border-sepia/20 space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2 text-cinnamon flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cinnamon" />
                기본 설정
              </h3>
              <p className="ml-3.5">
                손님에게 표시될 입금 계좌번호/예금주, 테이블 현황 화면의 테이블
                행/열 수를 설정합니다.
              </p>
            </div>
            <div className="pt-6 border-t border-sepia/10">
              <h3 className="font-bold text-lg mb-2 text-cinnamon flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cinnamon" />
                메뉴 설정
              </h3>
              <p className="ml-3.5">메뉴를 추가/수정/삭제할 수 있습니다.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
