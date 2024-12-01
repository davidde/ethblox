type Props = {
  className: string,
  content: string,
}

// To figure out how the Speech Bubble works, check out https://codepen.io/davidde/pen/emONpNe.
// Basically the span element is the speech bubble, and the ::after pseudo element is the triangle.
// Important for the triangle is that the top & bottom borders are colored, and the left & right
// borders are transparent: `after:border-y-[var(--main-fg-color)] after:border-x-transparent`.
// Also, the bottom position should be equal to the negative of the top border width:
// `after:bottom-[-1rem]` = - `after:border-t-[1rem]`.
// And finally, the left & right border-width `after:border-x-[1rem]` controls the angle
// of the triangle, while left controls the horizontal position: `after:left-1/2`.
export default function SpeechBubble(props: Props) { // from-[var(--inverse-bg-color)] to-[var(--inverse-bg-color-lighter)]
  return (
      <span
        className={`${props.className} ` +
          `absolute p-1.5 rounded-lg text-[0.8rem] -top-9 left-[-47%] ` +
          `bg-gradient-to-t from-indigo-900 to-blue-400 text-[var(--main-bg-color)] ` +
          `dark:from-[var(--inverse-bg-color)] dark:to-[var(--inverse-bg-color-lighter)] dark:text-[var(--main-fg-color)] ` +
          `after:content-[''] after:block after:absolute after:w-0 after:left-1/2 ` +
          `after:bottom-[-.5rem] after:border-t-[.5rem] after:border-x-[0.5rem] after:border-b-[0rem] ` +
          `after:border-solid after:border-y-indigo-900 dark:after:border-y-[var(--inverse-bg-color)] after:border-x-transparent`
        }
      >
        {props.content}
      </span>
  );
}