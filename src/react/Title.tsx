import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MessageFormattedString from './MessageFormattedString'
import './Title.css'
import { withInjectableUi } from './extendableSystem'

export type AnimationTimes = {
  fadeIn: number,
  stay: number,
  fadeOut: number
}

type TitleProps = {
  title: string | Record<string, any>,
  subtitle: string | Record<string, any>,
  actionBar: string | Record<string, any>,
  transitionTimes: AnimationTimes,
  openTitle: boolean,
  openActionBar: boolean
}

const TitleBase = ({
  title,
  subtitle,
  actionBar,
  transitionTimes,
  openTitle = false,
  openActionBar = false
}: TitleProps) => {
  const [mounted, setMounted] = useState(false)

  const defaultFadeIn = 0.5
  const defaultFadeOut = 1

  useEffect(() => {
    if (!mounted && (openTitle || openActionBar)) {
      setMounted(true)
    }
  }, [openTitle, openActionBar])

  // Định nghĩa các biến thể (variants) để xử lý thời gian fadeIn và fadeOut riêng biệt chuẩn cấu trúc framer-motion
  const animationVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: transitionTimes?.fadeIn ? transitionTimes.fadeIn / 1000 : defaultFadeIn
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: transitionTimes?.fadeOut ? transitionTimes.fadeOut / 1000 : defaultFadeOut
      }
    }
  }

  return (
    <div className='title-container'>
      <AnimatePresence>
        {openTitle && (
          <motion.div
            variants={animationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <h1 className='message-title'>
              <MessageFormattedString message={title} />
            </h1>
            <h4 className='message-subtitle'>
              <MessageFormattedString message={subtitle} />
            </h4>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {openActionBar && (
          <motion.div
            variants={animationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className='message-action-bar'>
              <MessageFormattedString message={actionBar} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default withInjectableUi(TitleBase, 'title')
