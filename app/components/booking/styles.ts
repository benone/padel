import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f5' },

  /* Header */
  header: { width: '100%', height: 280, overflow: 'hidden' },
  headerImage: { width: '100%', height: '100%', position: 'absolute' },
  headerBtns: {
    position: 'absolute',
    top: 6,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /* White panel */
  panel: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  panelHeader: { padding: 20, paddingBottom: 0 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clubTitle: { fontSize: 24, fontWeight: '700', color: '#1f2937' },
  address: { fontSize: 16, color: '#6b7280', marginBottom: 20 },

  /* Tabs */
  tabsContainer: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabsRow: { flexDirection: 'row' },
  tab: { 
    paddingBottom: 12, 
    paddingHorizontal: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  tabTextMuted: { fontSize: 16, color: '#6b7280' },
  tabTextActive: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: 80,
    backgroundColor: '#1f2937',
    borderRadius: 1,
  },

  /* Scroll content */
  scrollBody: { flexGrow: 1, paddingBottom: 100 },

  /* Date selector */
  dateRow: { paddingHorizontal: 20, paddingRight: 40, paddingTop: 20 },
  dateCard: {
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    minWidth: 65,
  },
  dateCardSelected: { backgroundColor: '#1f2937', borderWidth: 0 },
  dateDay: { fontSize: 12, color: '#6b7280', marginBottom: 2 },
  dateNumber: { fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 2 },
  dateMonth: { fontSize: 12, color: '#6b7280' },
  dateSelectedText: { color: '#ffffff' },

  /* Time slots */
  slotsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 10,
  },
  slot: {
    width: '18.4%',
    paddingVertical: 16,
    marginRight: '2%',
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotSelected: { backgroundColor: '#1f2937' },
  slotDisabled: { backgroundColor: '#f3f4f6', opacity: 0.5 },
  slotText: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  slotTextSelected: { color: '#ffffff' },
  slotTextDisabled: { color: '#9ca3af' },
  slotSubText: { fontSize: 10, color: '#6b7280', marginTop: 2 },
  slotSubTextSelected: { color: '#d1d5db' },
  slotSubTextDisabled: { color: '#9ca3af' },

  /* Alerts */
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 10,
    marginBottom: 20,
  },
  alertText: { fontSize: 16, color: '#1f2937' },

  /* Home tab content */
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
  },
  sportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sportText: {
    fontSize: 18,
    color: '#1f2937',
  },
  courtsText: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 20,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    gap: 6,
  },
  amenityText: {
    fontSize: 12,
    color: '#4b5563',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionBtnActive: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionBtnOutline: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1f2937',
  },
  mapContainer: {
    height: 160,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginTop: 12,
  },
  mapSubText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  comingSoon: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  comingSoonSub: {
    fontSize: 16,
    color: '#6b7280',
  },
});