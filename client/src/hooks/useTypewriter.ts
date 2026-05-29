import { useEffect, useState } from "react";
//This custom React hook creates a typewriter effect for text. It takes a string and gradually reveals it one character at a time instead of displaying the entire message instantly. When the text changes, the hook resets the displayed value to an empty string, starts a timer, and continuously adds the next character until the full text has been shown. The speed parameter controls how quickly each character appears. It also cleans up the timer when the component unmounts or the text changes to prevent memory leaks. In simple terms, this hook makes text appear as if someone is typing it out on the screen letter by letter.
export function useTypewriter(text: string, speed = 28) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue("");
    if (!text) {
      return;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setValue(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [speed, text]);

  return value;
}
