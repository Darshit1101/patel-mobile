import connectToDatabase from '@/lib/mongodb';
import Combo from '@/models/Combo';
import { NextResponse } from 'next/server';

// GET - Get mobile names for a specific combo
export async function GET(request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const comboName = searchParams.get('comboName');

        if (!comboName) {
            return NextResponse.json({
                success: false,
                message: 'Combo name is required'
            }, { status: 400 });
        }

        const combo = await Combo.findOne({ comboName: comboName });

        if (!combo) {
            return NextResponse.json({
                success: false,
                message: 'Combo not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                comboName: combo.comboName,
                mobileNames: combo.mobileNames || [],
                count: combo.mobileNames ? combo.mobileNames.length : 0
            }
        });
    } catch (error) {
        console.error('Error fetching combo mobile names:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch combo mobile names. Please try again later.'
        }, { status: 500 });
    }
}