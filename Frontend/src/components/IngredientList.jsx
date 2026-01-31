

const IngredientList = ({ ingredients }) => {
    let parsedIngredients = [];

    try {
        if (Array.isArray(ingredients)) {
            parsedIngredients = ingredients;
        } else if (typeof ingredients === 'string') {
            // Try parsing JSON first
            try {
                const parsed = JSON.parse(ingredients.replace(/'/g, '"')); // Simple fix for python-style dicts/lists if needed
                if (Array.isArray(parsed)) {
                    parsedIngredients = parsed;
                } else {
                    // Split by newlines or commas if not JSON array
                    parsedIngredients = ingredients.split(/\n/).filter(i => i.trim() !== '');
                }
            } catch (e) {
                // Fallback to simple split if JSON parse fails
                parsedIngredients = ingredients.split(/\n/).filter(i => i.trim() !== '');
                // If split by newline results in single item, try split by comma
                if (parsedIngredients.length <= 1 && ingredients.includes(',')) {
                    parsedIngredients = ingredients.split(',').filter(i => i.trim() !== '');
                }
            }
        }
    } catch (error) {
        console.error("Error parsing ingredients:", error);
        parsedIngredients = [ingredients]; // Fallback to displaying as is
    }

    // Deduplicate and clean
    parsedIngredients = [...new Set(parsedIngredients)].map(i => i.replace(/^['"]|['"]$/g, '').trim());


    if (!parsedIngredients || parsedIngredients.length === 0) {
        return <p className="text-gray-500 italic">No ingredients listed.</p>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-emerald-600 border-b pb-2">Ingredients</h3>
            <ul className="space-y-2">
                {parsedIngredients.map((item, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                        <span className="inline-block w-2 h-2 mt-2 mr-3 bg-emerald-400 rounded-full flex-shrink-0"></span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IngredientList;
