import { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import exitIcon from '../../assets/icons/exit-icon.svg';
import styles from './SettingsPage.module.css';

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleEnable2FA = async () => {
    setError('');
    setSuccess('');
    
    // TODO: Заменить на реальный API запрос
    // Симуляция генерации QR кода
    setTimeout(() => {
      // В реальном приложении здесь будет URL QR кода от сервера
      setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Fakegram:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Fakegram');
      setShowQRCode(true);
    }, 500);
  };

  const handleVerify2FA = async () => {
    setError('');
    setSuccess('');

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }

    // TODO: Заменить на реальный API запрос для верификации
    setTimeout(() => {
      // Симуляция успешной верификации
      setIs2FAEnabled(true);
      setShowQRCode(false);
      setQrCode(null);
      setVerificationCode('');
      setSuccess('Двухфакторная аутентификация успешно включена!');
    }, 500);
  };

  const handleDisable2FA = async () => {
    setError('');
    setSuccess('');

    // TODO: Заменить на реальный API запрос для отключения
    setTimeout(() => {
      setIs2FAEnabled(false);
      setSuccess('Двухфакторная аутентификация отключена');
    }, 500);
  };

  const handleCancelSetup = () => {
    setShowQRCode(false);
    setQrCode(null);
    setVerificationCode('');
    setError('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Настройки</h1>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Безопасность</h2>
        </div>

        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <div className={styles.settingLabel}>Двухфакторная аутентификация</div>
            <div className={styles.settingDescription}>
              {is2FAEnabled 
                ? 'Защитите свой аккаунт с помощью дополнительного кода при входе'
                : 'Добавьте дополнительный уровень защиты для вашего аккаунта'}
            </div>
          </div>
          <div className={styles.settingAction}>
            {is2FAEnabled ? (
              <button onClick={handleDisable2FA} className={styles.dangerButton}>
                Отключить
              </button>
            ) : (
              <button onClick={handleEnable2FA} className={styles.primaryButton}>
                Включить
              </button>
            )}
          </div>
        </div>

        {showQRCode && qrCode && (
          <div className={styles.qrSection}>
            <div className={styles.qrContainer}>
              <h3 className={styles.qrTitle}>Настройка 2FA</h3>
              <p className={styles.qrInstructions}>
                1. Установите приложение-аутентификатор (Google Authenticator, Authy и т.д.)
              </p>
              <p className={styles.qrInstructions}>
                2. Отсканируйте QR-код в приложении:
              </p>
              <div className={styles.qrCodeWrapper}>
                <img src={qrCode} alt="QR Code" className={styles.qrCodeImage} />
              </div>
              <p className={styles.qrInstructions}>
                3. Введите 6-значный код из приложения:
              </p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className={styles.codeInput}
                maxLength={6}
              />
              <div className={styles.qrActions}>
                <button onClick={handleVerify2FA} className={styles.primaryButton}>
                  Подтвердить
                </button>
                <button onClick={handleCancelSetup} className={styles.secondaryButton}>
                  Отменить
                </button>
              </div>
            </div>
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Аккаунт</h2>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <img src={exitIcon} alt="Выход" className={styles.icon} />
          <span>Выйти из аккаунта</span>
        </button>
      </div>
    </div>
  );
};
