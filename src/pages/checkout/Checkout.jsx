import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatters';
import { Input } from '../../components/common/Input';
import axiosInstance from '../../api/axiosConfig';

// Inicializar Stripe con la clave pública — solo se carga una vez
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// ── Estilos para los elementos de Stripe ─────────────────────────────────────
const STRIPE_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontFamily: 'var(--font-body), sans-serif',
      fontSize: '14px',
      color: '#3D2B1F',
      letterSpacing: '0.03em',
      '::placeholder': { color: '#B8A898' },
    },
    invalid: { color: '#8B4545' },
  },
};

// ── Step indicator ────────────────────────────────────────────────────────────
const StepIndicator = ({ current, steps }) => (
  <div className="flex items-center justify-center gap-0 mb-14">
    {steps.map((label, i) => {
      const idx = i + 1;
      const done = idx < current;
      const active = idx === current;
      return (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${active || done ? 'var(--gold)' : 'rgba(212,184,150,0.4)'}`,
              backgroundColor: done ? 'var(--gold)' : 'transparent',
              fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500,
              color: done ? 'var(--white)' : active ? 'var(--gold)' : 'var(--stone-light)',
              transition: 'all 0.4s',
            }}>
              {done ? '✓' : idx}
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: active ? 'var(--gold)' : 'var(--stone-light)' }}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: '60px', height: '1px', background: `linear-gradient(90deg, ${done ? 'var(--gold)' : 'rgba(212,184,150,0.3)'}, rgba(212,184,150,0.3))`, margin: '0 12px', marginBottom: '22px' }} />
          )}
        </div>
      );
    })}
  </div>
);

// ── Confirmación ──────────────────────────────────────────────────────────────
const OrderConfirmed = ({ orderNumber, onDone }) => (
  <div className="text-center py-16 animate-fade-up max-w-lg mx-auto">
    <div style={{ width: '88px', height: '88px', margin: '0 auto 2rem', border: '1px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    </div>
    <span className="text-label block mb-3">Pedido confirmado</span>
    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--espresso)', marginBottom: '1rem' }}>
      Gracias por su compra
    </h2>
    <div className="gold-line-center mb-6" />
    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--stone)', lineHeight: 1.9, marginBottom: '0.5rem' }}>
      Su pedido ha sido procesado exitosamente.
    </p>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--stone-light)', marginBottom: '2.5rem' }}>
      Número de orden: <strong style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>#{orderNumber}</strong>
    </p>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--stone)', marginBottom: '2rem', fontStyle: 'italic' }}>
      Recibirá un correo de confirmación en breve con los detalles de su envío.
    </p>
    <button onClick={onDone} className="btn-gold">Volver a la tienda</button>
  </div>
);

// ── Formulario de pago con Stripe Elements ────────────────────────────────────
// Componente separado porque useStripe/useElements requieren estar dentro de <Elements>
const StripePaymentForm = ({ finalTotal, items, onSuccess, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [stripeError, setStripeError] = useState('');

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setProcessing(true);
    setStripeError('');

    try {
      // 1. Pedir clientSecret al backend
      const response = await axiosInstance.post('/orders/create-payment-intent', {
        amount: finalTotal,
        items,
      });
      const { clientSecret } = response.data.data;

      // 2. Confirmar el pago con Stripe.js usando el CardNumberElement
      const cardElement = elements.getElement(CardNumberElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setStripeError(error.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess();
      }
    } catch (err) {
      setStripeError(typeof err === 'string' ? err : 'Error al procesar el pago. Intente nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  const labelStyle = {
    display: 'block', marginBottom: '0.5rem',
    fontFamily: 'var(--font-body)', fontSize: '0.6rem',
    letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)',
  };

  const elementWrap = {
    padding: '0.875rem 1rem',
    border: '1px solid rgba(212,184,150,0.3)',
    backgroundColor: 'var(--white)',
    transition: 'border-color 0.3s',
  };

  return (
    <div style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.25)', boxShadow: 'var(--shadow-soft)', padding: '2rem' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '1.5rem' }}>
        Información de pago
      </h3>

      {/* Badge modo prueba */}
      <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(184,151,90,0.06)', border: '1px solid rgba(184,151,90,0.2)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--stone)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--gold-dark)' }}>Modo de prueba:</strong> Use la tarjeta{' '}
          <code style={{ background: 'rgba(184,151,90,0.1)', padding: '0.1rem 0.4rem', fontFamily: 'monospace' }}>4242 4242 4242 4242</code>,
          cualquier fecha futura y cualquier CVV de 3 dígitos.
        </p>
      </div>

      <div className="space-y-5">
        {/* Número de tarjeta */}
        <div>
          <label style={labelStyle}>Número de tarjeta</label>
          <div style={elementWrap}>
            <CardNumberElement options={STRIPE_ELEMENT_OPTIONS} />
          </div>
        </div>

        {/* Expiración y CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Vencimiento</label>
            <div style={elementWrap}>
              <CardExpiryElement options={STRIPE_ELEMENT_OPTIONS} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>CVV</label>
            <div style={elementWrap}>
              <CardCvcElement options={STRIPE_ELEMENT_OPTIONS} />
            </div>
          </div>
        </div>

        {/* Error de Stripe */}
        {stripeError && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#8B4545', padding: '0.75rem', backgroundColor: 'rgba(139,69,69,0.06)', border: '1px solid rgba(139,69,69,0.2)' }}>
            {stripeError}
          </p>
        )}

        {/* Acciones */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="btn-ghost flex-1"
            style={{ padding: '1rem' }}
            disabled={processing}
          >
            ← Volver
          </button>
          <button
            type="button"
            onClick={handlePay}
            className="btn-gold flex-1"
            style={{ padding: '1rem', fontSize: '0.75rem', opacity: (!stripe || processing) ? 0.7 : 1 }}
            disabled={!stripe || processing}
          >
            {processing ? 'Procesando...' : `Pagar ${formatPrice(finalTotal)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Checkout principal ────────────────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber] = useState(() => Math.floor(100000 + Math.random() * 900000));

  const shipping = totalPrice >= 150000 ? 0 : 5990;
  const finalTotal = totalPrice + shipping;

  const { register, handleSubmit, formState: { errors } } = useForm();

  if (items.length === 0 && !confirmed) {
    return (
      <div className="text-center py-24">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '1rem' }}>Su bolsa está vacía</h2>
        <Link to="/productos" className="btn-gold">Explorar colección</Link>
      </div>
    );
  }

  if (confirmed) {
    return <OrderConfirmed orderNumber={orderNumber} onDone={() => navigate('/')} />;
  }

  const handleShipping = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setConfirmed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sectionTitle = (text) => (
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '1.5rem' }}>{text}</h3>
  );

  return (
    <div className="animate-fade-up max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-label block mb-3">Finalizar compra</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: 'var(--espresso)' }}>Checkout</h1>
        <div className="gold-line-center mt-3" />
      </div>

      <StepIndicator current={step} steps={['Envío', 'Pago', 'Confirmación']} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

        {/* ── Formulario principal ── */}
        <div className="lg:col-span-2">

          {/* PASO 1: Envío */}
          {step === 1 && (
            <form onSubmit={handleSubmit(handleShipping)}>
              <div style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.25)', boxShadow: 'var(--shadow-soft)', padding: '2rem' }}>
                {sectionTitle('Información de envío')}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label="Nombre" placeholder="Juan" {...register('firstName', { required: 'Requerido' })} error={errors.firstName?.message} />
                    <Input label="Apellido" placeholder="Pérez" {...register('lastName', { required: 'Requerido' })} error={errors.lastName?.message} />
                  </div>
                  <Input label="Correo electrónico" type="email" placeholder="juan@ejemplo.com" {...register('email', { required: 'Requerido' })} error={errors.email?.message} />
                  <Input label="Teléfono" type="tel" placeholder="+56 9 1234 5678" {...register('phone', { required: 'Requerido' })} error={errors.phone?.message} />
                  <Input label="Dirección" placeholder="Av. Providencia 1234" {...register('address', { required: 'Requerido' })} error={errors.address?.message} />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Input label="Ciudad" placeholder="Santiago" {...register('city', { required: 'Requerido' })} error={errors.city?.message} />
                    <Input label="Región" placeholder="Metropolitana" {...register('region', { required: 'Requerido' })} error={errors.region?.message} />
                    <Input label="Código postal" placeholder="7500000" {...register('zip')} />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-gold w-full mt-5" style={{ padding: '1rem', fontSize: '0.75rem' }}>
                Continuar al pago →
              </button>
            </form>
          )}

          {/* PASO 2: Pago con Stripe real */}
          {step === 2 && (
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                finalTotal={finalTotal}
                items={items}
                onSuccess={handlePaymentSuccess}
                onBack={() => setStep(1)}
              />
            </Elements>
          )}
        </div>

        {/* ── Resumen del pedido ── */}
        <div style={{ backgroundColor: 'var(--white)', border: '1px solid rgba(212,184,150,0.25)', boxShadow: 'var(--shadow-soft)', padding: '1.75rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--espresso)', marginBottom: '1.25rem' }}>Resumen</h3>
          <div className="space-y-3 mb-5">
            {items.map(item => (
              <div key={item.perfume._id} className="flex justify-between gap-3">
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--charcoal)' }}>{item.perfume.name}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--stone-light)' }}>x{item.quantity}</p>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--espresso)', whiteSpace: 'nowrap' }}>
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(212,184,150,0.2)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div className="flex justify-between">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--stone)' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--charcoal)' }}>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--stone)' }}>Envío</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: shipping === 0 ? '#6B8F6B' : 'var(--charcoal)' }}>
                {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
              </span>
            </div>
            <div style={{ borderTop: '1px solid rgba(212,184,150,0.2)', paddingTop: '0.75rem', marginTop: '0.25rem' }} className="flex justify-between">
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--espresso)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold-dark)' }}>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {shipping === 0 && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: '#6B8F6B', textAlign: 'center', marginTop: '1rem', letterSpacing: '0.06em' }}>
              ✓ Envío gratuito aplicado
            </p>
          )}
        </div>
      </div>
    </div>
  );
}