import React from "react";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";
/* 이 파일은 firebase에게 로그인한 사용자가 누구인지 묻는 곳
 로그인된 경우  protected route로 이동
 그렇지 않다면 계정 생성 페이지로 리디렉션*/
// react component처럼 children을 가짐
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // firebase에게 유저 정보를 요청
  const user = auth.currentUser;
  // 로그인 되어있지 않다면 로그인 페이지로 이동
  if (user === null) {
    return <Navigate to="/login" />;
  }
  /* 로그인 되어있으면 children을 반환
  여기서 children의 prop은 React.ReactNode타입으로 
  문자열, 숫자, 배열 등... 여러 변수들을 저장하고 있는 타입이다.
  로그인 되었으면 children에 해당하는 인자(Protected route 하위 페이지)를 보여줌
  */
  return children;
  /* 추가로 더 설명하자면 App.tsx에서 <ProtectedRoute>로 감싸진
  인자들이 리턴되는 것
 ex) return<Home />
  */
}
