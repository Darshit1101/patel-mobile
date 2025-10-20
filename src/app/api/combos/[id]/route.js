import connectToDatabase from '@/lib/mongodb';
import Combo from '@/models/Combo';
import { NextResponse } from 'next/server';

// GET - Fetch a specific combo
export async function GET(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;

        const combo = await Combo.findById(id);

        if (!combo) {
            return NextResponse.json({
                success: false,
                message: 'Combo not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: combo
        });
    } catch (error) {
        console.error('Error fetching combo:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch combo'
        }, { status: 500 });
    }
}

// PUT - Update a combo
export async function PUT(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;
        const body = await request.json();

        const { comboName, mobileNames } = body;

        // Validation
        if (!comboName) {
            return NextResponse.json({
                success: false,
                message: 'Combo name is required'
            }, { status: 400 });
        }

        if (!mobileNames || !Array.isArray(mobileNames) || mobileNames.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'At least one mobile name is required'
            }, { status: 400 });
        }

        // Filter out empty mobile names
        const validMobileNames = mobileNames.filter(name => name && name.trim());

        if (validMobileNames.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'At least one valid mobile name is required'
            }, { status: 400 });
        }

        // Check if combo exists
        const existingCombo = await Combo.findById(id);
        if (!existingCombo) {
            return NextResponse.json({
                success: false,
                message: 'Combo not found'
            }, { status: 404 });
        }

        // Check if another combo with same name exists (excluding current combo)
        const duplicateCombo = await Combo.findOne({
            comboName,
            _id: { $ne: id }
        });

        if (duplicateCombo) {
            return NextResponse.json({
                success: false,
                message: 'Combo with this name already exists'
            }, { status: 400 });
        }

        const updatedCombo = await Combo.findByIdAndUpdate(
            id,
            {
                comboName: comboName.trim(),
                mobileNames: validMobileNames.map(name => name.trim())
            },
            { new: true, runValidators: true }
        );

        return NextResponse.json({
            success: true,
            data: updatedCombo,
            message: 'Combo updated successfully'
        });
    } catch (error) {
        console.error('Error updating combo:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update combo'
        }, { status: 500 });
    }
}

// DELETE - Delete a combo
export async function DELETE(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;

        // Check if combo exists
        const combo = await Combo.findById(id);
        if (!combo) {
            return NextResponse.json({
                success: false,
                message: 'Combo not found'
            }, { status: 404 });
        }

        // Delete the combo
        await Combo.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Combo deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting combo:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to delete combo'
        }, { status: 500 });
    }
}