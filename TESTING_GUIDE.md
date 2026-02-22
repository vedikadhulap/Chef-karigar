# 🎯 Quick Testing Guide

## Immediate Testing Checklist

### 1. Dark Mode Toggle 🌓
- **Location**: Header (top-right corner)
- **Action**: Click the sun/moon toggle button
- **Expected**: Entire app transitions smoothly between light and dark themes
- **Persistence**: Theme is saved to localStorage

### 2. Smart Matching & AI Scoring 🎯
**Steps**:
1. Click "Agency Admin Login" at bottom of landing page
2. Select "Support" role
3. Click "BUSINESS PARTNERS" tab
4. Click "Source Staff" on any job
5. **See**: Each candidate shows:
   - Color-coded Match % badge
   - Skill, Location, and Experience breakdown scores
   - Green badges (85%+), Blue (70-84%), Orange (50-69%)

### 3. Real-time Chat System 💬
**Steps**:
1. Go to "Business Dashboard" (login as business)
2. In "New Profiles Available" section
3. Click "Approve for Trial" on any candidate
4. **See**: Chat bubble appears in bottom-right corner
5. Click the bubble to open chat
6. Send a message
7. **See**: Auto-response from agency support after 2 seconds

### 4. Toast Notifications 🔔
**Triggers**:
- Post a new job → "Job posted successfully!" ✅
- Approve candidate → "Approved for trial! Chat is now active." 💬
- Book a lead → "Appointment booked!" ✅
- Refer candidate → "Candidate added to Agency Dashboard!" 🎉

**All notifications appear in top-right corner**

### 5. Interactive Map 🗺️
**Steps**:
1. Go to "Sales Partner" dashboard
2. Click "Nearby Opportunities" (top navigation)
3. **See**: Interactive map with:
   - Animated center marker
   - Multiple opportunity markers
   - Hover tooltips with details
4. Click any marker for notification

### 6. Micro-interactions ✨
**Throughout the app, notice**:
- Cards fade in on load
- Buttons scale on hover/tap
- Modal windows zoom in
- Smooth transitions everywhere
- Staggered list animations

### 7. Skeleton Loaders ⏳
**To see skeletons**:
- Map component shows loading state on mount
- Look for pulsing gray rectangles during data loads

## 🎨 Visual Testing

### Landing Page
- ✅ Three role cards with hover effects
- ✅ Icons scale up on hover
- ✅ Smooth transitions
- ✅ Dark mode compatible

### Business Dashboard
- ✅ Three stat cards with animations
- ✅ "New Profiles Available" badge
- ✅ Chat bubble integration
- ✅ Job posting form with validation

### Agency Support Console
- ✅ Match scores with color coding
- ✅ Editable fields with audit history
- ✅ Filter/search functionality
- ✅ Responsive data table

### External Sales View
- ✅ Interactive map visualization
- ✅ Lead cards with booking system
- ✅ Referral tracking table
- ✅ Commission calculators

## 🐛 Common Issues & Solutions

### Issue: Dark mode not applying
**Solution**: Clear localStorage and refresh page

### Issue: Chat not appearing
**Solution**: Make sure you clicked "Approve for Trial" first

### Issue: Map not loading
**Solution**: Wait for 2-second simulated loading time

### Issue: Notifications not showing
**Solution**: Check if react-hot-toast is properly imported

## 🎬 Demo Script

**For a complete walkthrough**:

1. **Start**: Landing page in light mode
2. **Toggle**: Dark mode on
3. **Login**: Business → Post a job → See success toast
4. **View**: New profile → Approve for trial → Chat opens
5. **Switch**: Agency Support → Source staff → See match scores
6. **Navigate**: Sales Partner → View map → Click markers
7. **Interact**: Book a lead → See notification
8. **Toggle**: Back to light mode

**Total Demo Time**: ~3 minutes

## 📱 Responsive Testing

✅ Mobile (< 768px): Stacked layouts, bottom sheet modals
✅ Tablet (768px - 1024px): Two-column grids
✅ Desktop (> 1024px): Full multi-column layouts

## 🚀 Performance Checks

- [ ] Page loads in < 2s
- [ ] Dark mode toggle is instant
- [ ] Animations are smooth (60fps)
- [ ] Chat messages appear instantly
- [ ] Map renders without lag

## 🎓 Key Learning Points

### For Frontend Team
- ThemeContext pattern for global state
- Framer Motion for declarative animations
- TypeScript interfaces for API contracts
- Component composition with ChatHub

### For Backend Team
- All API functions are in `services/api.ts`
- Mock implementations show expected behavior
- TypeScript interfaces define data structures
- Replace mocks with real API calls

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Verify all dependencies are installed (`npm install`)
3. Clear browser cache and localStorage
4. Restart dev server (`npm run dev`)

---

**🎉 Congratulations on your upgraded platform!**

The app is running at: http://localhost:3000
