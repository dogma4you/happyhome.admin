import useLoading from "../store/useLoading";

export default function Loading() {
  const isLoading = useLoading((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
}
