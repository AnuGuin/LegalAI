'use client'

import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const navbarVariants = {
  initial: {
    y: -100,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween" as const,
      ease: "easeOut" as const,
      duration: 0.6,
      delay: 0.6,
    },
  },
};

const containerVariants = {
  scrolled: {
    maxWidth: "768px",
    transition: {
      type: "tween" as const,
      ease: "easeInOut" as const,
      duration: 0.5,
    },
  },
  initial: {
    maxWidth: "1152px",
    transition: {
      type: "tween" as const,
      ease: "easeInOut" as const,
      duration: 0.5,
    },
  },
};

const menuItemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07 + 0.3,
      type: "tween" as const,
      ease: "easeOut" as const,
      duration: 0.4,
    },
  }),
};

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    scale: 0.97,
    y: -12,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "tween" as const,
      ease: "easeOut" as const,
      duration: 0.35,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -8,
    transition: {
      type: "tween" as const,
      ease: "easeIn" as const,
      duration: 0.25,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "tween" as const,
      ease: "easeOut" as const,
      duration: 0.4,
    },
  },
  hover: {
    scale: 1.04,
    transition: {
      type: "spring" as const,
      stiffness: 250,
      damping: 20,
    },
  },
  tap: { scale: 0.96 },
};


const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'Testimonials', href: '#testimonial' },
    { name: 'Pricing', href: '#pricing' }
]



const smoothScrollTo = (href: string) => {
    if (href.startsWith('#')) {
        const element = document.querySelector(href)
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }
    }
}

export const Navbar = ({ animate = false }: { animate?: boolean }) => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleNavClick = (href: string) => {
        smoothScrollTo(href)
        setMenuState(false) 
    }

    return (
        <motion.header
            variants={navbarVariants}
            initial={animate ? "initial" : false}
            animate="animate"
        >
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2">
                <motion.div 
                    variants={containerVariants}
                    animate={isScrolled ? "scrolled" : "initial"}
                    // CSS transitions and maxWidth classes are removed from here
                    className={cn(
                        'mx-auto mt-2 px-6 lg:px-12', 
                        isScrolled && 'bg-background/50 rounded-2xl border backdrop-blur-lg lg:px-5 shadow-lg'
                    )}
                >
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Link
                                    href="#home"
                                    aria-label="home"
                                    className="flex items-center space-x-2"
                                    onClick={() => handleNavClick('#home')}
                                >
                                    <Logo />
                                </Link>
                            </motion.div>

                            <motion.button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.1 }}
                            >
                                <motion.div
                                    animate={{
                                        rotate: menuState ? 90 : 0,
                                        scale: menuState ? 0 : 1,
                                        opacity: menuState ? 0 : 1,
                                    }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                >
                                    <Menu className="m-auto size-6 duration-200" />
                                </motion.div>
                                <motion.div
                                    animate={{
                                        rotate: menuState ? 0 : -90,
                                        scale: menuState ? 1 : 0,
                                        opacity: menuState ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="absolute inset-0"
                                >
                                    <X className="m-auto size-6 duration-200" />
                                </motion.div>
                            </motion.button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-base">
                                {menuItems.map((item, index) => (
                                    <motion.li 
                                        key={index}
                                        variants={menuItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={index}
                                    >
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                        >
                                            <button
                                                onClick={() => handleNavClick(item.href)}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150 relative group"
                                            >
                                                <span>{item.name}</span>
                                                <div
                                                    className="absolute -bottom-1 left-0 h-0.5 bg-blue-500 rounded-full w-0 group-hover:w-full transition-all duration-300"
                                                />
                                            </button>
                                        </motion.div>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background data-[state=active]:block lg:data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <AnimatePresence>
                                {menuState && (
                                    <motion.div
                                        variants={mobileMenuVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="lg:hidden"
                                    >
                                        <ul className="space-y-6 text-lg">
                                            {menuItems.map((item, index) => (
                                                <motion.li 
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ 
                                                        delay: index * 0.1 + 0.1, 
                                                        duration: 0.4,
                                                        ease: "easeOut" as const
                                                    }}
                                                >
                                                    <button
                                                        onClick={() => handleNavClick(item.href)}
                                                        className="text-muted-foreground hover:text-accent-foreground block duration-150 w-full text-left"
                                                    >
                                                        <span>{item.name}</span>
                                                    </button>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <motion.div
                                    variants={buttonVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className={cn(isScrolled && 'lg:hidden')}>
                                        <Link href="/auth">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                </motion.div>
                                <motion.div
                                    variants={buttonVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <Button
                                        asChild
                                        size="sm"
                                        className={cn("bg-blue-600 hover:bg-blue-700 text-white border-blue-600", isScrolled && 'lg:hidden')}>
                                        <Link href="/auth">
                                            <span>Sign Up</span>
                                        </Link>
                                    </Button>
                                </motion.div>
                                <motion.div
                                    variants={buttonVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap="tap"
                                    className={cn(isScrolled ? 'lg:block' : 'hidden')}
                                >
                                    <Button
                                        asChild
                                        size="sm"
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                                        <Link href="/auth">
                                            <span>Get Started</span>
                                        </Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </nav>
        </motion.header>
    )
}