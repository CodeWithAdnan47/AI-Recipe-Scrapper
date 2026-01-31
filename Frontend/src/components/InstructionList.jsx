
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
        return <p className="text-gray-500 italic">No instructions provided.</p>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-emerald-600 border-b pb-2">Instructions</h3>
            <ol className="space-y-4">
                {parsedInstructions.map((step, index) => (
                    <li key={index} className="flex">
                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold mr-4 text-sm">
                            {index + 1}
                        </span>
                        <div className="mt-1 text-gray-700 leading-relaxed">
                            {step}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default InstructionList;
