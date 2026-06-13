const PrimaryButton = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`
        bg-gradient-to-r
        from-violet-600
        to-blue-600
        px-7
        py-3
        rounded-xl
        font-semibold
        shadow-lg
        shadow-violet-600/30
        transition-all
        duration-300
        hover:scale-105
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;