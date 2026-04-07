# Design Guidelines: Student Attendance Excel Processing Application

## Design Approach
**System-Based Approach**: Drawing from Material Design and Google Workspace patterns for data-centric productivity applications. This utility-focused tool prioritizes clarity, efficiency, and familiar spreadsheet interactions.

## Core Design Principles
1. **Data Clarity First**: Information hierarchy optimized for scanning tabular data
2. **Familiar Patterns**: Leverage spreadsheet conventions users already understand
3. **Processing Confidence**: Clear visual feedback throughout the data transformation workflow
4. **Responsive Functionality**: Maintain usability across devices while prioritizing desktop experience

## Typography System
**Font Families**: 
- Primary: Inter (UI elements, labels, buttons)
- Data Display: Roboto Mono (tables, cell content for better number alignment)

**Type Scale**:
- Page Title: 32px/bold
- Section Headers: 20px/semibold
- Labels & Instructions: 14px/medium
- Table Headers: 13px/semibold, uppercase, letter-spacing: 0.5px
- Table Data: 14px/regular
- Helper Text: 12px/regular

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-6
- Section margins: mb-8
- Grid gaps: gap-4
- Input/button padding: px-4 py-2

**Grid Structure**:
- Main container: max-w-7xl mx-auto px-6
- Single column layout for workflow clarity
- Tables: full-width with horizontal scroll on mobile

## Component Library

### 1. Grade Selector (Top Priority)
- Radio button group or segmented control
- Options: "1-2학년" and "3학년"
- Positioned prominently at top of interface
- Clear active state indication

### 2. Bulk Paste Input Area
**Primary Feature Component**:
- Large textarea (min-height: 300px desktop, 200px mobile)
- Dashed border (2px) to indicate drop zone aesthetic
- Placeholder text with icon and instructions:
  - Icon: clipboard or paste symbol
  - Text: "Excel 데이터를 여기에 붙여넣기 (Ctrl+V / Cmd+V)"
  - Secondary instruction: "나이스 출결 데이터를 복사하여 붙여넣으세요"
- Focus state: border color change, subtle shadow

### 3. Data Preview Table
**Spreadsheet-Style Display**:
- Full-width scrollable table
- Sticky header row
- Alternating row backgrounds for readability (subtle stripe)
- Cell borders: 1px solid borders (grid pattern)
- Column headers: bold, centered alignment
- Data cells: 
  - Student numbers/names: left-aligned
  - Numeric data: right-aligned, tabular-nums
  - Padding: px-4 py-3
- Responsive: horizontal scroll on mobile with fixed first column

**Expected Columns**: 학생번호, 학생이름, 결석, 지각, 조퇴, 결과

### 4. Processing Controls
**Action Button Group**:
- Primary: "사정원안 생성" (Generate Report) - prominent, full CTA treatment
- Secondary: "데이터 지우기" (Clear Data) - ghost/outline style
- Button spacing: gap-4
- Position: Below preview table, right-aligned on desktop, full-width stacked on mobile

### 5. Results Summary Panel
**Post-Processing Display**:
- Card-style container with subtle border
- Grid layout for categories:
  - 1년 개근 (1-year perfect attendance): count badge
  - 1년 정근 (1-year good attendance): count badge
  - 3년 개근 (3-year perfect - 3학년 only): count badge
  - 3년 정근 (3-year good - 3학년 only): count badge
- Count badges: rounded, accent color background
- Download button: icon + text "엑셀 다운로드"

### 6. Status & Feedback
**Processing States**:
- Loading: spinner with "처리 중..." message
- Success: checkmark icon with "완료되었습니다" message
- Error: alert icon with specific error message
- Empty state: clipboard icon with "데이터를 붙여넣어주세요" prompt

### 7. Instructions Panel (Optional Collapsible)
- Accordion-style expandable section
- Icon: question mark or info symbol
- Content: Step-by-step usage guide
- Screenshots or visual aids describing the process

## Page Structure

**Header Section**:
- Application title: "사정원안 생성기"
- Subtitle: "나이스 출결 데이터 처리 시스템"
- Grade selector component

**Main Workflow Area** (vertical flow):
1. Input Section
   - Section header: "데이터 입력"
   - Paste area component
   - Helper text below

2. Preview Section (appears after paste)
   - Section header: "데이터 미리보기" + row count indicator
   - Preview table
   - Processing controls

3. Results Section (appears after processing)
   - Section header: "생성 결과"
   - Summary panel
   - Download controls

**Footer**:
- Minimal: version info or help link

## Interaction Patterns

**Data Flow**:
1. User selects grade level → Grade selector updates
2. User pastes data → Input area validates → Preview appears
3. User reviews preview → Can edit/clear if needed
4. User clicks generate → Loading state → Results display
5. User downloads Excel → Success confirmation

**Table Interactions**:
- Horizontal scroll on overflow
- Sort capability on column headers (optional enhancement)
- Row hover state for easier scanning

**Validation Feedback**:
- Invalid paste format: inline error message below textarea
- Empty required fields: button disabled state + tooltip
- Successful processing: success message + auto-scroll to results

## Responsive Behavior

**Desktop (≥1024px)**:
- Side-by-side layout for instructions + input (if instructions present)
- Full table visibility
- Right-aligned action buttons

**Tablet (768px-1023px)**:
- Single column layout
- Table maintains structure with horizontal scroll
- Full-width buttons

**Mobile (<768px)**:
- Stacked vertical layout
- Simplified table view (key columns only, expandable rows)
- Full-width touch-friendly buttons (min-height: 44px)
- Sticky grade selector at top

## Accessibility
- Semantic HTML table structure
- ARIA labels for data regions
- Keyboard navigation for table
- Focus indicators on all interactive elements
- Screen reader announcements for state changes

This design creates a focused, professional tool that transforms complex Excel processing into a streamlined web workflow while maintaining the familiarity of spreadsheet applications.