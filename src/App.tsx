import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import { styled } from "styled-components";
import ProtectedRoute from "./components/protected-route";

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      /*
      ProtectedRoute 파일에서도 언급했던것 처럼
      로그인 되어있으면 Children을 반환
      반환된 Protected-Children은 Layout을 감쌈
      Layout은 Home 또는 Profile의 Children을 가지고 있음
      결론적으로 Protecetd-children(Layout-children)의 형태가 되는 것
      */
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: (
          /* 이렇게 설정해 두면 ProtectedRoute의 children으로 보내 질 것
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
          */
          <Home />
          // 우린 가능한 많은 영역에 이를 활용하려고 layout에 씌울거임
        ),
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color:white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

function App() {
  const [isLoading, settLoading] = useState(true);
  // firebase가 준비될 때 까지 대기하는 함수
  const init = async () => {
    /* 테스트용
    setTimeout(() => settLoading(false), 2000);
    */
    // firebase가 쿠키와 토큰을 읽고 로그인 여부를 확인하는동안 기다리겠다.
    await auth.authStateReady();
    settLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
