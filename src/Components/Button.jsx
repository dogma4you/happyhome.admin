import PropTypes from "prop-types";

export default function Button({ color, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full max-w-80 rounded-lg ${color} p-3 shadow text-white cursor-pointer text-center hover:brightness-110 hover:shadow-md`}
    >
      {text}
    </button>
  );
}

Button.propTypes = {
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
