import React, { useState } from "react";
import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { update } from "firebase/database";

const Form = styled.form``;

const Button = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  margin-right: 3px;
  margin-left: 3px;
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

const EditPayload = styled.input`
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
  box-sizing: border-box;
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

export default function EditTweetForm({ tweet, userId, id, username }: ITweet) {
  const user = auth.currentUser;
  const [editedTweet, setEditedTweet] = useState(tweet);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const maxSize = 1024 ** 2 * 10;

  // save
  const onSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (user?.uid !== userId) return;
    try {
      const docRef = doc(db, "tweets", id);
      await updateDoc(docRef, { tweet: editedTweet });
    } catch (e) {
      console.log(e);
    }
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
  return (
    <Form>
      <EditPayload
        type="text"
        value={editedTweet}
        onChange={(e) => setEditedTweet(e.target.value)}
      />
      <Button onClick={onSave}>Save</Button>
    </Form>
  );
}
