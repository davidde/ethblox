export default function ErrorIndicator(props: {
  error?: string,
  className?: string
}) {
  return (
    <span className={`${props.className} inline-block text-red-800`}>
      {props.error ?? 'Error'}
    </span>
  );
}
