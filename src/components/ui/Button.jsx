const Button = ({ children, variant = 'primary', ...props }) => {
  return (
    <button className={variant === 'primary' ? 'btn-primary' : 'btn-outline'} {...props}>
      {children}
    </button>
  );
};

export default Button;