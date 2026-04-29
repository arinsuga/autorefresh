# Release Notes - mCheckpoint v1.1.2

**Release Date:** September 18, 2025  
**Latest Stable Release**

---

## 🌟 Overview

Version 1.1.2 represents a major update to the mCheckpoint mobile application, bringing together comprehensive improvements from v1.1.0 and v1.1.1 with additional refinements. This release focuses on enhanced user experience, robust timezone support, flexible data filtering, and improved sharing capabilities.

---

## 🎨 FRONT-END

### Major UI/UX Improvements
- **Simplified Navigation**: Removed tabs and consolidated into a single, streamlined screen interface
- **Enhanced List Display**: Check-in/check-out records organized chronologically by date
- **Period-Based Filtering**: View data filtered by selected date ranges for better historical analysis
- **Image Visibility Control**: Toggle show/hide images for each check-in/check-out list item

### Share & Export Features
- **Enhanced Share Button**: 
  - Updated from "Share" to "View/Share" for clearer functionality
  - Generate PDF files based on selected period
  - Direct sharing to other applications
- **Period Dialog Enhancement**:
  - "Share" button (formerly "OK") to create and share reports
  - New "View" button for previewing before sharing

### Form & Input Enhancements
- **Location Management**: Added "Update Location" button for real-time location updates
- **Smart Input Focus**: Auto-focus on description field with automatic keyboard display
- **User Feedback**: Flash messages for successful or failed check-in/check-out operations
- **Pull to Refresh**: Implemented RefreshControl for easy data synchronization

### Timezone Support
- **Complete Timezone Integration**:
  - Display timezone information in the UI
  - Automatic validation of timezone data
  - Send timezone to backend (utctz, utcmillis, utcoffset)

### Dynamic Header
- **Context-Aware Display**:
  - Period view mode: Shows `DatePeriodInfo` component
  - Single date view: Shows `DateInfo` component

### Empty State Handling
- **Informative Messages**: Clear feedback when no check-in/checkout data exists for selected date or period

---

## ⚙️ BACK-END

### Bug Fixes
- **AbsenController Improvements**:
  - Enhanced error handling in `checkHistoryPost` with try-catch blocks
  - Improved error handling in `postHistoryByUserIdAndCheckpointDate`
  - More robust user data retrieval

### Enhanced Error Handling
- **New Service Response Methods**:
  - `viewModelError500` - Structured error responses for models
  - `viewJsonError500` - JSON-formatted error responses
  - `viewArrayError500` - Array-based error responses

### Timezone Persistence
- **Database Integration**:
  - Store timezone information (utctz, utcmillis, utcoffset)
  - Mandatory field validation for timezone data
  - Consistent timezone handling across all operations

---

## 🚀 CI/CD

### Automation & Deployment
- **Automated Bash Scripts**: Streamlined deployment process with .sh automation scripts
- **Database Patching**: Scripts for `users`, `roles`, and `attends` table updates
- **Version Tagging**: Deployment artifacts tagged as [v1.1.2] for better release tracking

---

## 🔧 CONFIGURATION

### Technical Updates
- **Dependency Management**: Resolved all conflicts in `package.json`
- **TypeScript Configuration**: Fixed and optimized `tsconfig.json`
- **Version Synchronization**: Updated version to 1.1.2 across all configuration files

---

## 📦 Installation & Upgrade

### For New Users
```bash
npm install
```

### For Existing Users
```bash
# Pull latest changes
git pull origin main

# Install updated dependencies
npm install
```

---

## 🎯 Key Highlights

✅ **Better User Experience**: Streamlined single-screen interface with intuitive navigation  
✅ **Flexible Data Viewing**: Period-based filtering for comprehensive history analysis  
✅ **Enhanced Sharing**: PDF generation with improved share/view controls  
✅ **Robust Timezone Support**: Complete timezone handling from UI to database  
✅ **Improved Reliability**: Better error handling and validation throughout  
✅ **Automated Deployment**: CI/CD improvements for faster, more reliable releases  

---

## 🐛 Bug Fixes
- Fixed dependency conflicts in package.json
- Fixed TypeScript configuration issues
- Enhanced error handling in history posting endpoints
- Improved data retrieval reliability with try-catch blocks

---

## 📱 Compatibility
- **Expo SDK**: ~51.0.28
- **React Native**: 0.74.5
- **Platform Support**: iOS and Android

---

## 🔄 Migration Notes
No breaking changes. This is a feature release with backward compatibility maintained.

---

## 👥 Contributors
Thank you to everyone who contributed to this release!

---

## 📞 Support
For issues or questions, please visit: [GitHub Issues](https://github.com/arinsuga/mcheckpoint/issues)
