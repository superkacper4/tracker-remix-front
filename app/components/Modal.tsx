import { ReactNode } from "react";

type Props = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export const Modal = ({ isOpen, title, children, onClose }: Props) => {
  if (!isOpen) return null;
  return (
    <div className="bg-gray-900/[.6] fixed h-screen w-screen ">
      <div className="rounded fixed top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 bg-white min-w-56 max-w-2xl min-h-40 w-full p-4">
        <div className="flex justify-between items-center">
          <h2>{title}</h2>
          <button
            onClick={onClose}
            className="text-red-400 bg-transparent hover:text-red-600 transition-colors"
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
