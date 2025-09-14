package com.farmprofit.ui.utils

import androidx.compose.material3.adaptive.WindowAdaptiveInfo
import androidx.window.core.layout.WindowHeightSizeClass
import androidx.window.core.layout.WindowWidthSizeClass

fun WindowAdaptiveInfo.isCompact(): Boolean {
    return windowSizeClass.windowWidthSizeClass == WindowWidthSizeClass.COMPACT
}

fun WindowAdaptiveInfo.isExpanded(): Boolean {
    return windowSizeClass.windowWidthSizeClass == WindowWidthSizeClass.EXPANDED ||
            windowSizeClass.windowWidthSizeClass == WindowWidthSizeClass.MEDIUM
}

fun WindowAdaptiveInfo.isMedium(): Boolean {
    return windowSizeClass.windowWidthSizeClass == WindowWidthSizeClass.MEDIUM
}