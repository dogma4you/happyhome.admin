import Notification from "./Notification";
export default function Header() {
  return (
    <div className="text-3xl font-bold w-full h-24 flex items-center justify-between p-4 border-b-2">
      <p>Hi Admin</p>
      <Notification />
    </div>
  );
}
