
const InstructionList = ({ instructions }) => {
    let parsedInstructions = [];

    try {
        if (Array.isArray(instructions)) {
            parsedInstructions = instructions;
        } else if (typeof instructions === 'string') {
            // Cleaning: Remove leading/trailing brackets if it looks like a stringified list
            let cleaned = instructions.trim();
            if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
                try {
                    // Try standard JSON parse
                    const parsed = JSON.parse(cleaned.replace(/'/g, '"'));
                    if (Array.isArray(parsed)) parsedInstructions = parsed;
                    else parsedInstructions = [cleaned];
                } catch (e) {
                    // If JSON parse fails, might be Python string representation, verify simple splits
                    cleaned = cleaned.substring(1, cleaned.length - 1);
                    parsedInstructions = cleaned.split("', '").map(s => s.replace(/^'|'$/g, ''));
                }
            } else {
                // Split by newlines which is common for text blocks
                parsedInstructions = cleaned.split(/\n/).filter(i => i.trim() !== '');
            }
        }
    } catch (error) {
        console.error("Error parsing instructions:", error);
        parsedInstructions = [instructions];
    }

    // Deduplicate and clean
    parsedInstructions = parsedInstructions.map(i => i.trim()).filter(i => i.length > 0);

    if (!parsedInstructions || parsedInstructions.length === 0) {
        return <p className="text-secondary-400 italic">No instructions provided.</p>;
    }

    return (
        <div>
            <h3 className="text-2xl font-display font-bold text-secondary-900 mb-6 border-b border-secondary-100 pb-4">
                Instructions
            </h3>
            <ol className="space-y-8">
                {parsedInstructions.map((step, index) => (
                    <li key={index} className="flex group">
                        <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-secondary-50 text-primary-600 font-display font-bold mr-6 text-lg border border-secondary-100 shadow-sm group-hover:bg-primary-50 group-hover:border-primary-200 transition-all duration-300">
                            {index + 1}
                        </span>
                        <div className="mt-1.5 text-secondary-700 leading-relaxed text-lg">
                            {step}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default InstructionList;
