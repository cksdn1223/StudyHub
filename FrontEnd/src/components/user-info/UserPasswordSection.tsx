import { useState } from "react";
import Card from "../public/Card";
import PasswordChangeModal from "./PasswordChangeModal";

function UserPasswordSection() {
  const [open, setOpen] = useState(false);

  return (
    <Card title="보안">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          계정 보안을 위해 주기적으로 비밀번호를 변경해주세요.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300"
        >
          비밀번호 변경
        </button>
      </div>
      {open && <PasswordChangeModal onClose={() => setOpen(false)} />}
    </Card>
  );
}


export default UserPasswordSection;