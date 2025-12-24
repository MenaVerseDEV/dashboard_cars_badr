const ConditionedWrapper = ({
  condition,
  children,
  className,
}: {
  condition: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  return <>{condition && <div className={className}>{children}</div>}</>;
};

export default ConditionedWrapper;

