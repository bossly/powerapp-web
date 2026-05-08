#!/bin/bash

# Find Sparkle's generate_appcast tool in Xcode DerivedData
# This tool automatically reads the DMG, generates the EdDSA signature, and updates appcast.xml
GENERATE_APPCAST=$(find ~/Library/Developer/Xcode/DerivedData -name generate_appcast | head -n 1)

if [ -z "$GENERATE_APPCAST" ]; then
    echo "❌ Error: Could not find generate_appcast in DerivedData."
    echo "Please build the Power Xcode project at least once so Swift Package Manager downloads the Sparkle tools."
    exit 1
fi

echo "✅ Found generate_appcast at: $GENERATE_APPCAST"

# Ensure at least one DMG exists in public/
DMG_COUNT=$(ls public/*.dmg 2>/dev/null | wc -l)
if [ "$DMG_COUNT" -eq 0 ]; then
    echo "❌ Error: No DMG files found in the public directory."
    echo "Please place the new DMG in the public directory and try again."
    exit 1
fi

LATEST_DMG=$(ls -t public/*.dmg 2>/dev/null | head -n 1)
echo "📦 Found latest DMG: $LATEST_DMG"

echo "🔄 Generating appcast..."
"$GENERATE_APPCAST" public/

echo "✅ Appcast generation complete!"
