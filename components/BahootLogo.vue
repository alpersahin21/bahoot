<template>
      <div class="logo-wrapper">
    <div class="bahoot-logo" ref="logoElement" :class="[sizeClass, colorClass]">
      <span class="logo-text">Bahoot</span><span class="exclamation">!</span>
    </div>
  </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  interface Props {
    variant?: 'white' | 'purple'
    size?: 'small' | 'medium' | 'large'
    animated?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    variant: 'purple',
    size: 'medium',
    animated: true
  })
  
  const logoElement = ref<HTMLElement>()
  
  const sizeClass = computed(() => {
    switch (props.size) {
      case 'small':
        return 'size-small'
      case 'medium':
        return 'size-medium'
      case 'large':
        return 'size-large'
      default:
        return 'size-medium'
    }
  })

  const colorClass = computed(() => {
    return props.variant === 'white' ? 'color-white' : 'color-purple'
  })
  
  const restartAnimation = () => {
    if (!props.animated || !logoElement.value) return
    
    logoElement.value.style.animation = 'none'
    setTimeout(() => {
      if (logoElement.value) {
        logoElement.value.style.animation = ''
      }
    }, 10)
  }
  </script>
  
  <style scoped>
  .logo-wrapper {
    display: inline-block;
  }
  

  
  .bahoot-logo {
    font-family: 'Arial Black', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 900;
    letter-spacing: -3px;
    display: inline-block;
    position: relative;
    user-select: none;
  }

  .color-white {
    color: white;
  }

  .color-purple {
    color: #6c3fc9;
  }
  
  .bahoot-logo::before {
    content: 'Bahoot';
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    color: rgba(255, 255, 255, 0.1);
    transform: translate(2px, 2px);
  }
  
  .logo-text {
    display: inline-block;
  }
  
  .exclamation {
    display: inline-block;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: rotate(-3deg) translateY(0);
    }
    50% {
      transform: rotate(-3deg) translateY(-10px);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: rotate(5deg) translateY(-5px) scale(1);
    }
    50% {
      transform: rotate(5deg) translateY(-5px) scale(1.1);
    }
  }
  
  /* Size variations */
  .size-small {
    font-size: 18px;
  }
  
  .size-medium {
    font-size: 24px;
  }
  
  .size-large {
    font-size: 60px;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .logo-container {
      padding: 40px 50px;
    }
    
    .bahoot-logo {
      font-size: 60px;
    }
    
    .exclamation {
      font-size: 70px;
    }
  }
  
  @media (max-width: 480px) {
    .logo-container {
      padding: 30px 35px;
    }
    
    .bahoot-logo {
      font-size: 36px;
      letter-spacing: -2px;
    }
    
    .exclamation {
      font-size: 40px;
    }
  }
  
  /* No animation variant */
  .no-animation .bahoot-logo {
    animation: none;
  }
  
  .no-animation .exclamation {
    animation: none;
  }
  </style>