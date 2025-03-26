export default function CheckboxPrivacidad({ setAceptoPolitica }) {
    return (
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          onChange={(e) => setAceptoPolitica(e.target.checked)}
          className="w-4 h-4"
        />
        <span>Acepto la política de privacidad</span>
      </label>
    );
  }
  