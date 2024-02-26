import { createUserWithEmailAndPassword } from "firebase/auth/cordova";
import React, { useState } from "react";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Error,
  Input,
  Wrapper,
  Title,
  Form,
  Switcher,
} from "../components/auth-components";
import GitHubButton from "../components/github-btn";

export default function CreateAccount() {
  const navigate = useNavigate();
  // 로딩 상태를 나타내는 코드
  const [isLoading, setLoading] = useState(false);
  // useState를 사용한 게정 생성에 필요한 값을 받는 곳
  const [name, setName] = useState("");
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
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
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
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user);
      // 유저 프로필 생성 및 업데이트
      await updateProfile(credentials.user, {
        displayName: name,
      });
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
      <Title>Join to my web page</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
        />
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
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account? <Link to="/login">Log in &rarr;</Link>
      </Switcher>
      <GitHubButton />
    </Wrapper>
  );
}
