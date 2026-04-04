interface RadioGroupProps {
    readonly label: string;
    readonly name: string;
    readonly value: string;
    readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readonly options?: readonly string[];
}

/** Toggle-button style radio group — mejor UX para mobile. */
export default function RadioGroup({
    label,
    name,
    value,
    onChange,
    options = ['SI', 'NO', 'N/A'],
}: RadioGroupProps) {
    // Clases base que NO varían entre activo/inactivo
    const baseClass = [
        'px-3 py-1.25 text-xs font-semibold cursor-pointer',
        'border-[1.5px] transition-all font-[inherit]',
        'max-sm:flex-1 max-sm:text-center max-sm:py-2 max-sm:px-1',
    ].join(' ');

    return (
        <div className="flex justify-between items-center py-2.5 border-b border-gray-100 gap-4 max-sm:flex-col max-sm:items-start max-sm:gap-2 max-sm:py-2">
            {/* Label */}
            <span className="flex-1 font-medium text-[0.8125rem] text-gray-700 min-w-0">
                {label}
            </span>

            {/* Options */}
            <div className="flex shrink-0 max-sm:w-full">
                {options.map((opt, i) => {
                    const isActive = value === opt;
                    const roundClass =
                        i === 0 ? 'rounded-l-md' :
                        i === options.length - 1 ? 'rounded-r-md' : '';
                    const overlapClass = i > 0 ? '-ml-[1.5px]' : '';

                    // Active y inactive son completamente separados — sin conflictos de cascade
                    const stateClass = isActive
                        ? 'bg-navy-800 border-navy-800 text-white relative z-1'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-navy-800 hover:text-navy-800';

                    return (
                        <label
                            key={opt}
                            className={`${baseClass} ${roundClass} ${overlapClass} ${stateClass}`}
                        >
                            <input
                                type="radio"
                                name={name}
                                value={opt}
                                checked={isActive}
                                onChange={onChange}
                                className="absolute opacity-0 pointer-events-none"
                            />
                            {opt}
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
