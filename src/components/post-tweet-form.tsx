import { addDoc, collection, updateDoc } from "firebase/firestore";
import { styled } from "styled-components";
import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttacthFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  // 1MB
  const maxSize = 10 * 1024 * 1024;

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 타입이 file인 input이 변경될 때 마다 파일의 배열을 받게됨
    // 왜냐하면 어떤 input은 복수의 파일을 업로드 하기 때문
    const { files } = e.target;
    // 여기는 파일이 오직 한 개 인지 확인하는 코드
    // 코드 챌린지! 파일 업로드 용량제한 설정하기
    if (files && files[0].size > maxSize) {
      alert("Your file size is over 10MB!");
      return;
    }
    if (files && files.length === 1) {
      //맞다면 첫 번째 파일을 가지고 setFile함수를 작동
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 100) return;
    try {
      setLoading(true);
      // 어떤 컬렉션,경로에 문서를 만들지 정함
      // db는 firebase.ts에서 export한 변수
      const doc = await addDoc(collection(db, "tweets"), {
        // 여기는 평범한 자바스크립트
        tweet,
        createAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}`
        );
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, { photo: url });
      }
      setFile(null);
      setTweet("");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        onChange={onChange}
        value={tweet}
        placeholder="What is happening?"
      />
      <AttachFileButton htmlFor="file">
        {file ? "✅Photo added" : "Add Photo"}
      </AttachFileButton>
      <AttacthFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn type="submit" value={isLoading ? "Posting..." : "PostTweet"} />
    </Form>
  );
}
