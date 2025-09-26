
import { Subject, ChapterWeightage } from '../types';
import { HISTORICAL_WEIGHTAGE_DATA } from '../constants';

/**
 * Predicts chapter weightage for a given subject using a simple weighted average of historical data.
 * @param {Subject} subject - The subject (Physics, Chemistry, or Mathematics).
 * @returns {ChapterWeightage[]} - An array of objects with chapter names and their predicted weightage.
 * 
 * JEST-like test stub:
 * test('predictWeightage should return a valid weightage array for Physics', () => {
 *   const weightage = predictWeightage(Subject.Physics);
 *   expect(Array.isArray(weightage)).toBe(true);
 *   expect(weightage.length).toBeGreaterThan(0);
 *   expect(weightage[0]).toHaveProperty('name');
 *   expect(weightage[0]).toHaveProperty('value');
 *   const total = weightage.reduce((sum, item) => sum + item.value, 0);
 *   expect(Math.round(total)).toBe(100);
 * });
 */
export const predictWeightage = (subject: Subject): ChapterWeightage[] => {
    const subjectData = HISTORICAL_WEIGHTAGE_DATA[subject];
    const years = Object.keys(subjectData).sort().reverse();
    const latestYearData = subjectData[years[0]] || {};
    const allChapters = Object.keys(latestYearData);
    
    const weightedAverages: { [chapter: string]: { totalWeight: number, totalValue: number } } = {};

    years.forEach((year, index) => {
        // More recent years have higher weight. e.g., for 3 years [2023, 2022, 2021], weights are [3, 2, 1]
        const weight = years.length - index;
        const yearData = subjectData[year];
        
        for (const chapter of allChapters) {
            if (!weightedAverages[chapter]) {
                weightedAverages[chapter] = { totalWeight: 0, totalValue: 0 };
            }
            const value = yearData[chapter] || 0;
            weightedAverages[chapter].totalWeight += weight;
            weightedAverages[chapter].totalValue += value * weight;
        }
    });

    const predictions: { [chapter: string]: number } = {};
    for (const chapter of allChapters) {
        const avgData = weightedAverages[chapter];
        predictions[chapter] = avgData.totalValue / avgData.totalWeight;
    }
    
    // Normalize to 100%
    const totalPredictedValue = Object.values(predictions).reduce((sum, v) => sum + v, 0);
    
    const finalWeightage = allChapters.map(chapter => ({
        name: chapter,
        value: (predictions[chapter] / totalPredictedValue) * 100,
    }));

    return finalWeightage;
};
