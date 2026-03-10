<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { gsap } from 'gsap';
  import { useMessage } from 'naive-ui';

  const router = useRouter();
  const message = useMessage();
  const loading = ref(false);

  // 表单数据
  const loginForm = reactive({
    username: '',
    password: '',
  });

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      message.warning('请填写完整的登录信息');
      return;
    }
    loading.value = true;

    // 模拟登录逻辑
    setTimeout(() => {
      loading.value = false;
      message.success('欢迎回来！');
      router.push('/');
    }, 1500);
  };

  // 页面加载时的 GSAP 动效（延续 404 风格）
  onMounted(() => {
    const tl = gsap.timeline();
    tl.from('.login-card', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
      .from(
        '.login-title',
        {
          x: -30,
          opacity: 0,
          duration: 0.5,
        },
        '-=0.4',
      )
      .from(
        '.form-item',
        {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1, // 表单项依次浮现
        },
        '-=0.3',
      )
      .from(
        '.login-btn',
        {
          scale: 0.9,
          opacity: 0,
          duration: 0.5,
          ease: 'back.out(2)',
        },
        '-=0.2',
      );
  });
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">{{ $t('login.login') || 'LOGIN' }}</h1>
        <p class="login-subtitle">{{ $t('login.welcome') || '欢迎登录管理系统' }}</p>
      </div>

      <div class="login-form">
        <div class="form-item">
          <label>{{ $t('login.username') || '账号' }}</label>
          <NInput
            v-model:value="loginForm.username"
            type="text"
            size="large"
            :placeholder="$t('common.pleaseInput') || '请输入账号'"
            class="custom-input"
          >
            <template #prefix>
              <IEpUser />
            </template>
          </NInput>
        </div>

        <div class="form-item">
          <label>{{ $t('login.password') || '密码' }}</label>
          <NInput
            v-model:value="loginForm.password"
            type="password"
            size="large"
            show-password-on="mousedown"
            :placeholder="$t('common.pleaseInput') || '请输入密码'"
            class="custom-input"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <IEpLock />
            </template>
          </NInput>
        </div>

        <div class="form-options form-item">
          <NCheckbox>{{ $t('login.rememberMe') || '记住我' }}</NCheckbox>
          <a class="forget-pwd">{{ $t('login.forgetPassword') || '忘记密码？' }}</a>
        </div>

        <NButton
          type="primary"
          :loading="loading"
          class="login-btn"
          @click="handleLogin"
        >
          {{ $t('login.submit') || '立即登录' }}
        </NButton>
      </div>

      <div class="login-footer form-item">
        <p>© 2026 Your System. All Rights Reserved.</p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    background-color: var(--bg-body);
    background-image:
      radial-gradient(at 0% 0%, rgba(var(--color-primary-rgb), 0.05) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(var(--color-primary-rgb), 0.05) 0px, transparent 50%);
    overflow: hidden;

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 40px;
      background: var(--bg-card);
      border-radius: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--border-base);

      .login-header {
        text-align: center;
        margin-bottom: 36px;

        .login-title {
          font-size: 42px;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(135deg, var(--color-primary), #a0cfff);
          background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 2px;
        }

        .login-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          margin-top: 8px;
        }
      }

      .login-form {
        :deep(.n-input .n-input__input-el, .n-input .n-input__textarea-el) {
          text-decoration-color: var(--bg-card) !important;
        }

        .form-item {
          margin-bottom: 24px;

          label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-primary);
          }
        }

        .custom-input {
          :deep(.n-input-wrapper) {
            border-radius: 12px;
            background-color: var(--bg-input);
          }
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;

          .forget-pwd {
            color: var(--color-primary);
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
        }

        .login-btn {
          width: 100%;
          height: 48px;
          border-radius: 24px;
          font-size: 16px;
          font-weight: 600;
          margin-top: 10px;
          box-shadow: 0 10px 20px -5px rgba(var(--color-primary-rgb), 0.4);
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px -5px rgba(var(--color-primary-rgb), 0.5);
          }
        }
      }

      .login-footer {
        margin-top: 32px;
        text-align: center;
        font-size: 12px;
        color: var(--text-secondary);
      }
    }
  }

  // 移动端适配
  @media (max-width: 480px) {
    .login-card {
      margin: 20px;
      padding: 30px 24px;
    }
  }
</style>
