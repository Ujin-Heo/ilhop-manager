"use client";

import { useEffect, useRef, useCallback } from "react";
import { BASE_URL } from "@/lib/api/config";
import { WebSocketMessage } from "@/lib/definitions";

// 외부에서 훅을 사용할 때 넘겨줄 옵션
interface UseWebsocketOptions {
  onMessage?: (message: WebSocketMessage) => void; // message를 받았을 때 실행할 콜백 함수
  url?: string; // 연결할 url
}

export function useWebsocket({ onMessage, url = "/ws/orders" }: UseWebsocketOptions = {}) {
  // 페이지가 리렌더링되어도 WebSocket 객체와 타이머 ID가 초기화되지 않고 유지되도록 useRef 사용
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectRef = useRef<() => void>(() => {});

  // ===== connect 함수: 실제 웹소켓 연결을 생성하고, 각종 이벤트 핸들러를 등록함 =========================
  const connect = useCallback(() => {
    // 이미 웹소켓이 열려있는 상태라면 넘어감(이미 열려있는 것을 그대로 사용)
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    // 동적 URL 생성: 현재 페이지가 http -> ws 선택, https -> wss 선택
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsBaseUrl = BASE_URL.replace(/^https?:\/\//, "");
    const fullUrl = `${wsProtocol}//${wsBaseUrl}${url}`;

    // 새로운 웹소켓 객체 생성
    const socket = new WebSocket(fullUrl);

    // 이벤트 핸들러 등록하기 ///////////////////////////////////////

    // onopen: 연결 성공 시 실행됨. 만약 재연결 시도 중이었다면 기존 타이머를 제거함
    socket.onopen = () => {
      console.log(`WebSocket connected to ${fullUrl}`);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    // onmessage: 서버로부터 데이터를 받았을 때 실행됨.
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        if (message.event && message.data) {
          onMessage?.(message);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    // onclose: 연결이 끊어지면 3초 후에 connect()를 다시 호출하여 자동으로 재연결을 시도함
    socket.onclose = () => {
      console.log("WebSocket disconnected");
      reconnectTimeoutRef.current = setTimeout(() => {
        connectRef.current();
      }, 3000);
    };

    // onerror: 에러 발생 시 로그를 남기고 소켓을 닫아 onclose 로직이 실행되도록 유도함
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      socket.close();
    };

    socketRef.current = socket;
  }, [onMessage, url]);
  // ==== connect 함수 끝 ========================================================================

  // connect 함수를 ref에 저장
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    // effect 함수: 의존성 배열([connect]) 안의 컴포너트가 변경될 때마다 실행됨
    connect();

    // cleanup 함수: 다음 effect가 실행 되기 전, 혹은 컴포넌트가 화면에서 사라지기(unmount) 직전에 호출됨
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data: unknown) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.error("WebSocket is not connected");
    }
  }, []);

  return { sendMessage };
}
