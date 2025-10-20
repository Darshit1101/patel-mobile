import connectToDatabase from '@/lib/mongodb';
import Combo from '@/models/Combo';
import { NextResponse } from 'next/server';

// GET - Fetch all combos
export async function GET() {
    try {
        await connectToDatabase();
        const combos = await Combo.find({}).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: combos
        });
    } catch (error) {
        console.error('Error fetching combos:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch combos. Please try again later.'
        }, { status: 500 });
    }
}

// POST - Create a new combo
export async function POST(request) {
    try {
        await connectToDatabase();
        const body = await request.json();

        const { comboName, mobileNames } = body;

        // Validation
        if (!comboName) {
            return NextResponse.json({
                success: false,
                message: 'Combo name is required. Please provide a name for your mobile combo.'
            }, { status: 400 });
        }

        if (!mobileNames || !Array.isArray(mobileNames) || mobileNames.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'At least one mobile device is required. Please add mobile devices to your combo.'
            }, { status: 400 });
        }

        // Filter out empty mobile names
        const validMobileNames = mobileNames.filter(name => name && name.trim());

        if (validMobileNames.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Please provide valid mobile device names. Empty entries are not allowed.'
            }, { status: 400 });
        }

        // Check if combo with same name already exists
        const existingCombo = await Combo.findOne({ comboName });
        if (existingCombo) {
            return NextResponse.json({
                success: false,
                message: 'A combo with this name already exists. Please choose a different name.'
            }, { status: 400 });
        }

        const combo = new Combo({
            comboName: comboName.trim(),
            mobileNames: validMobileNames.map(name => name.trim())
        });

        await combo.save();

        return NextResponse.json({
            success: true,
            data: combo,
            message: 'Mobile combo created successfully! Your new combo has been saved.'
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating combo:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create combo. Please try again later.'
        }, { status: 500 });
    }
}