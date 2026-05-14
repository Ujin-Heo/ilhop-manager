"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Loader2, CheckCircle2, Copy, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { createOrder, updateOrderMemo } from "@/lib/api/orders";
import { getMetadata } from "@/lib/api/metadata";
import { MetaDataResponse } from "@/lib/definitions";
import { useCart } from "@/lib/contexts/cart-context";
import { useCustomer } from "@/lib/contexts/customer-context";
import { useWebsocket } from "@/lib/hooks/use-websocket";
import { useRouter } from "next/navigation";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNum: string;
}

type Step =
  | "payment-method"
  | "depositor-input"
  | "waiting-payment"
  | "payment-confirmed";

export default function OrderModal({
  isOpen,
  onClose,
  tableNum,
}: OrderModalProps) {
  const { cart, setCart } = useCart();
  const { customer } = useCustomer();
  const router = useRouter();

  const [step, setStep] = useState<Step>("payment-method");
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH" | "TRANSFER" | null
  >(null);
  const [depositor, setDepositor] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<MetaDataResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch metadata on mount
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const data = await getMetadata();
        setMetadata(data);
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      }
    };
    fetchMeta();
  }, []);

  const handleCopy = async () => {
    if (metadata?.accountNumber) {
      try {
        await navigator.clipboard.writeText(metadata.accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  // WebSocket for payment status
  const handleMessage = useCallback(
    (message: any) => {
      if (message.event === "PAYMENT_CONFIRMED" && message.data.isPaid) {
        setIsPaid(true);
        setStep("payment-confirmed");
      }
    },
    [setStep, setIsPaid],
  );

  useWebsocket({
    url: orderId ? `/ws/payment-status/${orderId}` : null,
    onMessage: handleMessage,
  });

  // Auto-close countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "payment-confirmed" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (step === "payment-confirmed" && countdown === 0) {
      handleFinalClose();
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleFinalClose = () => {
    onClose();
    setCart({ totalAmount: 0, orderItems: [] });
    router.push(`/order/${tableNum}`);
  };

  const handleOrder = async (depositorName: string | null) => {
    setLoading(true);
    try {
      const items = cart.orderItems.map((item) => ({
        menuId: item.menuId,
        quantity: item.totalQuantity,
        priceAtOrder: item.unitPrice,
        selectedOption: item.selectedOption,
      }));

      const res = await createOrder({
        customerId: customer.customerId,
        totalPrice: cart.totalAmount,
        depositor: depositorName,
        items,
      });

      setOrderId(res.orderId);
      setStep("waiting-payment");
    } catch (error) {
      console.error("Order failed:", error);
      alert("주문에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrderApi = useCallback(
    async (options?: RequestInit) => {
      if (orderId) {
        try {
          await updateOrderMemo(orderId, { memo: "주문 취소" }, options);
        } catch (error) {
          console.error("Failed to update memo:", error);
        }
      }
    },
    [orderId],
  );

  const handleCancelOrder = useCallback(async () => {
    await cancelOrderApi();
    onClose();
  }, [cancelOrderApi, onClose]);

  // Handle page refresh/unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isOpen && orderId && !isPaid) {
        // Use keepalive to ensure the request completes after the page is unloaded
        cancelOrderApi({ keepalive: true });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isOpen, orderId, isPaid, cancelOrderApi]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("payment-method");
      setPaymentMethod(null);
      setDepositor("");
      setOrderId(null);
      setIsPaid(false);
      setCountdown(5);
      setLoading(false);
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-warm-beige shadow-2xl border border-sepia/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sepia/10">
          <h2 className="text-xl font-bold text-deep-brown">주문하기</h2>
          {step === "waiting-payment" && !isPaid ? (
            <button
              onClick={handleCancelOrder}
              className="flex items-center gap-1 text-sm font-bold text-red active:scale-95"
            >
              <X size={18} />
              주문 취소
            </button>
          ) : step === "payment-confirmed" ? (
            <button
              onClick={handleFinalClose}
              className="flex items-center gap-1 text-sm font-bold text-deep-brown active:scale-95"
            >
              <X size={18} />
              닫기
            </button>
          ) : (
            <button onClick={onClose} className="text-sepia active:scale-95">
              <X size={24} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          {step === "payment-method" && (
            <div className="space-y-6">
              <p className="text-center text-lg font-bold text-deep-brown leading-tight">
                결제 방식을 선택해주세요.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setPaymentMethod("CASH");
                    handleOrder(null); // 여기 안에서 waiting-payment 단계로 바꿈
                  }}
                  disabled={loading}
                  className="flex h-32 flex-col items-center justify-center rounded-2xl bg-white border-2 border-sepia/10 shadow-sm transition-all active:scale-95 hover:border-cinnamon disabled:opacity-50"
                >
                  <span className="text-3xl mb-2">💵</span>
                  <span className="text-lg font-bold text-deep-brown">
                    현금
                  </span>
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod("TRANSFER");
                    setStep("depositor-input");
                  }}
                  disabled={loading}
                  className="flex h-32 flex-col items-center justify-center rounded-2xl bg-white border-2 border-sepia/10 shadow-sm transition-all active:scale-95 hover:border-cinnamon disabled:opacity-50"
                >
                  <span className="text-3xl mb-2">🏦</span>
                  <span className="text-lg font-bold text-deep-brown">
                    계좌이체
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === "depositor-input" && (
            <div className="space-y-6">
              <p className="text-lg font-bold text-deep-brown">
                입금자명을 입력해주세요.
              </p>
              <input
                type="text"
                value={depositor}
                onChange={(e) => setDepositor(e.target.value)}
                placeholder="입금자명"
                className="w-full rounded-xl border-2 border-sepia/20 bg-white p-4 text-lg font-bold text-deep-brown focus:border-cinnamon focus:outline-none"
              />
              <button
                onClick={() => handleOrder(depositor)} // 여기 안에서 waiting-payment 단계로 바꿈
                disabled={!depositor.trim() || loading}
                className="w-full rounded-xl bg-cinnamon py-4 text-xl font-bold text-white transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="mx-auto animate-spin" />
                ) : (
                  "확인"
                )}
              </button>
            </div>
          )}

          {step === "waiting-payment" && (
            <div className="space-y-8 text-center">
              {paymentMethod === "CASH" ? (
                <p className="text-lg font-medium text-deep-brown leading-relaxed">
                  현금으로{" "}
                  <span className="text-blue font-bold">
                    {formatCurrency(cart.totalAmount)}
                  </span>
                  을 결제합니다.
                  <br />
                  직원을 호출해주세요.
                </p>
              ) : (
                <div className="space-y-4">
                  <p className="text-lg font-medium text-deep-brown leading-relaxed">
                    아래의 계좌로{" "}
                    <span className="text-blue font-bold">
                      {formatCurrency(cart.totalAmount)}
                    </span>
                    을
                    <br />
                    입금자명{" "}
                    <span className="text-blue font-bold">{depositor}</span>
                    (으)로 입금해주세요.
                  </p>
                  <div className="rounded-2xl bg-white p-6 font-bold border border-sepia/10 shadow-inner">
                    <p className="text-sepia text-sm mb-1">입금 계좌 안내 (클릭 시 복사)</p>
                    <div
                      onClick={handleCopy}
                      className="group relative flex cursor-pointer flex-col items-center gap-1 active:scale-95 transition-transform"
                    >
                      <p className="text-xl text-deep-brown flex items-center gap-2">
                        {metadata?.accountNumber || "로딩 중..."}
                        {metadata?.accountNumber && (
                          <span className="text-sepia/50 group-hover:text-sepia">
                            {copied ? (
                              <Check size={18} className="text-green" />
                            ) : (
                              <Copy size={18} />
                            )}
                          </span>
                        )}
                      </p>
                      {copied && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-deep-brown px-2 py-1 text-xs text-white">
                          복사 완료!
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-deep-brown">
                      예금주: {metadata?.accountHolder || "로딩 중..."}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center gap-3">
                <Loader2 size={48} className="animate-spin text-sepia" />
                <p className="text-base font-bold text-sepia">
                  {paymentMethod === "CASH" ? "결제 대기 중" : "입금 대기 중"}
                </p>
              </div>
            </div>
          )}

          {step === "payment-confirmed" && (
            <div className="space-y-8 text-center py-4">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-green/10 p-4">
                  <CheckCircle2 size={64} className="text-green" />
                </div>
                <p className="text-3xl font-bold text-deep-brown">
                  {paymentMethod === "CASH" ? "결제 완료" : "입금 완료"}
                </p>
              </div>
              <p className="text-sepia font-medium">
                {countdown}초 후 자동으로 닫기
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
