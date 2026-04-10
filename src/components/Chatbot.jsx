import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { HiChat, HiX, HiPaperAirplane } from 'react-icons/hi';

const QUESTIONS = [
  { id: 'name', type: 'text', prompt: "Hi there! 👋 What's your name?" },
  { id: 'email', type: 'email', prompt: "Nice to meet you! What's your email address?" },
  { id: 'business', type: 'text', prompt: "Great. What type of business do you run?" },
  { id: 'requirement', type: 'text', prompt: "What kind of website or digital solution are you looking for?" }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', business: '', requirement: '' });
  const [messages, setMessages] = useState([
    { sender: 'bot', text: QUESTIONS[0].prompt }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const isDragging = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isSubmitting) return;

    const currentQuestion = QUESTIONS[step];
    
    // Validate email
    if (currentQuestion.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
      setMessages(prev => [...prev, 
        { sender: 'user', text: inputValue },
        { sender: 'bot', text: "Please enter a valid email address." }
      ]);
      setInputValue('');
      return;
    }

    const newFormData = { ...formData, [currentQuestion.id]: inputValue };
    setFormData(newFormData);
    setInputValue('');

    setMessages(prev => [...prev, { sender: 'user', text: inputValue }]);

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: QUESTIONS[step + 1].prompt }]);
        setStep(step + 1);
      }, 600);
    } else {
      // Completed, save to Firebase
      setIsSubmitting(true);
      try {
        await addDoc(collection(db, 'leads'), {
          ...newFormData,
          source: 'chatbot',
          createdAt: serverTimestamp()
        });
        setTimeout(() => {
          setMessages(prev => [...prev, { sender: 'bot', text: "Thanks, I will contact you soon! 🚀" }]);
          setIsSubmitting(false);
        }, 1000);
      } catch (error) {
        console.error("Error saving lead: ", error);
        setTimeout(() => {
          setMessages(prev => [...prev, { sender: 'bot', text: "Oops, something went wrong. Please try the contact form." }]);
          setIsSubmitting(false);
        }, 1000);
      }
    }
  };

  return (
    <>
      <motion.button
        drag
        dragMomentum={false}
        onDragStart={() => isDragging.current = true}
        onDragEnd={() => setTimeout(() => isDragging.current = false, 150)}
        onClick={(e) => {
          if (isDragging.current) { e.preventDefault(); return; }
          setIsOpen(true);
        }}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 90,
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--purple), var(--green))',
          color: 'white', display: isOpen ? 'none' : 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
          boxShadow: '0 8px 32px rgba(124, 58, 237, 0.4)', border: 'none', cursor: 'grab',
          transition: 'transform 0.3s',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ cursor: 'grabbing' }}
      >
        <HiChat />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed', bottom: '24px', right: '24px', zIndex: 100,
              width: '350px', height: '500px', borderRadius: '20px',
              background: 'rgba(11, 15, 26, 0.95)', backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px', background: 'rgba(124, 58, 237, 0.1)',
              borderBottom: '1px solid var(--border)', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'var(--purple)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.2rem'
                }}>👨‍💻</div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', margin: 0 }}>Net Nirman</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--green-light)', margin: 0 }}>Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <HiX size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div style={{
              flex: 1, padding: '20px', overflowY: 'auto', display: 'flex',
              flexDirection: 'column', gap: '16px'
            }}>
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%', padding: '12px 16px',
                    borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                    background: msg.sender === 'user' ? 'var(--purple)' : 'rgba(255,255,255,0.05)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border)',
                    color: 'white', fontSize: '0.88rem', lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </motion.div>
              ))}
              {isSubmitting && (
                <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSubmit}
              style={{
                padding: '16px', borderTop: '1px solid var(--border)',
                display: 'flex', gap: '10px', background: 'rgba(5, 7, 12, 0.8)'
              }}
            >
              <input
                type={step < QUESTIONS.length ? QUESTIONS[step].type : 'text'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={step >= QUESTIONS.length || isSubmitting}
                placeholder={step >= QUESTIONS.length ? "Chat ended" : "Type your answer..."}
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: '10px',
                  border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)',
                  color: 'white', fontSize: '0.88rem', outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={step >= QUESTIONS.length || isSubmitting || !inputValue.trim()}
                style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'var(--green)', border: 'none', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: (step >= QUESTIONS.length || !inputValue.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (step >= QUESTIONS.length || !inputValue.trim()) ? 0.5 : 1
                }}
              >
                <HiPaperAirplane style={{ transform: 'rotate(90deg)' }} size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
