import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  texts,
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseDuration = 30000,
  className = '',
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (texts.length === 0) return;

    const currentText = texts[currentIndex];

    const handleTyping = () => {
      if (isTyping && !isDeleting && !isPaused) {
        // 打字阶段
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
          timeoutRef.current = setTimeout(handleTyping, typingSpeed);
        } else {
          // 打字完成，进入暂停阶段
          setIsTyping(false);
          setIsPaused(true);
          timeoutRef.current = setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, pauseDuration);
        }
      } else if (isDeleting && !isPaused) {
        // 删除阶段
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
          timeoutRef.current = setTimeout(handleTyping, deletingSpeed);
        } else {
          // 删除完成，切换到下一条
          setIsDeleting(false);
          setIsTyping(true);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      }
    };

    timeoutRef.current = setTimeout(handleTyping, isTyping ? typingSpeed : deletingSpeed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayText, currentIndex, isTyping, isDeleting, isPaused, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default TypewriterText;
