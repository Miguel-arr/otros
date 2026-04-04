/**
 * Textarea de formulario con label integrado.
 * Equivale al patrón: div.field > label.field__label > textarea.field__textarea
 */
interface FieldTextareaProps {
    readonly label: string;
    readonly name: string;
    readonly value: string;
    readonly onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    readonly rows?: number;
    readonly placeholder?: string;
    readonly className?: string;
}

export default function FieldTextarea({
    label,
    name,
    value,
    onChange,
    rows = 2,
    placeholder,
    className = '',
}: FieldTextareaProps) {
    return (
        <div className={`field ${className}`.trim()}>
            <label className="field__label" htmlFor={name}>{label}</label>
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                rows={rows}
                placeholder={placeholder}
                className="field__textarea"
            />
        </div>
    );
}
