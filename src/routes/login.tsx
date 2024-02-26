import React, { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Switcher,
  Form,
  Error,
  Title,
  Wrapper,
  Input,
} from "../components/auth-components";
import GitHubButton from "../components/github-btn";

export default function CreateAccount() {
  const navigate = useNavigate();
  // 로딩 상태를 나타내는 코드
  const [isLoading, setLoading] = useState(false);
  // useState를 사용한 게정 생성에 필요한 값을 받는 곳
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 에러처리
  const [error, setError] = useState("");
  // 객체e는 HTML 인풋값에 변화가 있을 경우
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e에서 타겟으로 name과 value 쌍을 받음
    const {
      target: { name, value },
    } = e;
    // 각 인풋값에 해당하는 이름이 일치할 경우  set함수를 작동
    if (name === "email") {
      setEmail(value);
    } else if (name == "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    // 여기에 계정 생성이랑 등... 만들것
    // 로딩중 이거나 이름, 이메일, 비밀번호가 비었는지 확인하는 코드
    if (isLoading || email === "" || password === "") return;
    try {
      setLoading(true);
      /* 이 함수는 firebase에서 지원하는 함수로 인증과 이메일, 비밀번호를 필요로함
      그리고 인증을 반환함
      */
      await signInWithEmailAndPassword(auth, email, password);
      // 계정 생성 후 홈('/')라우트로 보내기
      navigate("/");
      // 인증받지 못하면 여기 catch로 이동함
    } catch (e) {
      // 에러 코드
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>Log into here</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        />
        <Input type="submit" value={isLoading ? "Loading..." : "Log in"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account?{" "}
        <Link to="/create-account">Create one &rarr;</Link>
      </Switcher>
      <Switcher>
        Forgot your password?{" "}
        <Link to="/change-password">Reset your password &rarr;</Link>
      </Switcher>
      <GitHubButton />
    </Wrapper>
  );
}
