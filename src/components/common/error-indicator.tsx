export default function ErrorIndicator(props: { error: string, className?: string }) {
  if (props.error) {
    return (
      <span className={`${props.className} text-red-800`}>
        {props.error}
      </span>
    );
  }
}
