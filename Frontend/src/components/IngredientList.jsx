

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
        return <p className="text-secondary-400 italic">No ingredients listed.</p>;
    }

    return (
        <div className="h-full">
            <h3 className="text-2xl font-display font-bold text-secondary-900 mb-6 border-b border-secondary-100 pb-4">
                Ingredients
            </h3>
            <ul className="space-y-4">
                {parsedIngredients.map((item, index) => (
                    <li key={index} className="flex items-start group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-4 mt-0.5 group-hover:bg-primary-200 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                        </div>
                        <span className="text-secondary-700 leading-relaxed font-medium">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IngredientList;
