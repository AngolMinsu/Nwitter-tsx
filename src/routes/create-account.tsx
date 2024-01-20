import React, { useState } from "react";
import { styled } from "styled-components";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;

const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Title = styled.h1`
  font-size: 42px;
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export default function CreateAccount() {
  // 로딩 상태를 나타내는 코드
  const [isLoading, settLoading] = useState(false);
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
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 여기에 계정 생성이랑 등... 만들것
    try {
    } catch (e) {
    } finally {
      settLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>Log into 'set something here!'</Title>
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
    </Wrapper>
  );
}
