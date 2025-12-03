// App.tsx
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';

// ===== TYPES =====
type ScreenName = 'splash' | 'onboarding' | 'main';
type TabName = 'revexp' | 'enter' | 'profile';
type MoneyType = 'expenditure' | 'revenue';
type CurrencyCode = 'IDR' | 'USD' | 'INR';

type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

type RecordItem = {
  id: string;
  type: MoneyType;
  date: string; // "August 12, 2024"
  amount: string; // string yang diinput user
  note: string;
  categoryId: string;
  categoryName: string;
};

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  IDR: 'Rp',
  USD: '$',
  INR: '₹',
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// helper untuk format tanggal
const formatDate = (d: Date) => {
  const monthName = MONTHS[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  return `${monthName} ${day}, ${year}`;
};

// helper parse string tanggal → {monthIndex, year}
const parseMonthYear = (dateStr: string) => {
  const parts = dateStr.split(' ');
  const monthName = parts[0];
  const dayPart = parts[1] || '1';
  const yearPart = parts[2] || '2000';
  const day = parseInt(dayPart.replace(',', ''), 10) || 1;
  const year = parseInt(yearPart, 10) || 2000;
  const monthIndex = MONTHS.indexOf(monthName);
  return {monthIndex: monthIndex === -1 ? 0 : monthIndex, year, day};
};

const parseAmountToNumber = (str: string) => {
  if (!str) {
    return 0;
  }
  const cleaned = str.replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

// ===== MAIN APP =====
const App = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('splash');

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (currentScreen === 'splash') {
    return <SplashScreen />;
  }

  if (currentScreen === 'onboarding') {
    return (
      <OnboardingScreen onFirstSpending={() => setCurrentScreen('main')} />
    );
  }

  return <MainScreen />;
};

// ========= SPLASH SCREEN =========
const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.splashContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#3B2DFF" />

      <View style={styles.splashContent}>
        <Image
          source={require('./assets/celengan.png')}
          style={styles.splashIcon}
          resizeMode="contain"
        />
      </View>

      <View style={styles.splashBottomBarWrapper}>
        <View style={styles.splashBottomBar} />
      </View>
    </SafeAreaView>
  );
};

// ========= ONBOARDING =========

interface OnboardingProps {
  onFirstSpending: () => void;
}

const OnboardingScreen: React.FC<OnboardingProps> = ({onFirstSpending}) => {
  return (
    <SafeAreaView style={styles.onboardingContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F5FF" />

      <View style={styles.onboardingContent}>
        <View style={styles.appIconWrapper}>
          <View style={styles.appIcon}>
            <Image
              source={require('./assets/celengan.png')}
              style={styles.appIconImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <Text style={styles.appName}>MeNey</Text>

        <Text style={styles.appDescription}>Simple spending application</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onFirstSpending}
          activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>First spending</Text>
          <Text style={styles.primaryButtonArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ========= MAIN + BOTTOM NAV =========

const MainScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('revexp');
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [currency, setCurrency] = useState<CurrencyCode>('IDR');
  const [profileName, setProfileName] = useState<string>('Kittens saving');
  const [avatarIndex, setAvatarIndex] = useState<number>(0);

  const avatarOptions = ['🐱', '🐶', '🐼', '🐰', '🐨', '🐧'];

  const handleAddRecord = (item: RecordItem) => {
    setRecords(prev => [...prev, item]);
  };

  const symbol = CURRENCY_SYMBOLS[currency];

  const renderContent = () => {
    if (activeTab === 'revexp') {
      return (
        <RevExpTab
          onAddRecord={handleAddRecord}
          currencySymbol={symbol}
        />
      );
    }
    if (activeTab === 'enter') {
      return (
        <StatisticsTab
          records={records}
          currencySymbol={symbol}
        />
      );
    }
    return (
      <IndividualTab
        currency={currency}
        setCurrency={setCurrency}
        name={profileName}
        setName={setProfileName}
        avatar={avatarOptions[avatarIndex]}
        onChangeAvatar={() =>
          setAvatarIndex(prev => (prev + 1) % avatarOptions.length)
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F5FF" />

      <View style={{flex: 1}}>{renderContent()}</View>

      {/* bottom navigation */}
      <View style={styles.bottomNavWrapper}>
        <View style={styles.bottomNav}>
          <BottomNavItem
            label="Rev/Exp"
            icon="✏"
            active={activeTab === 'revexp'}
            onPress={() => setActiveTab('revexp')}
          />
          <BottomNavItem
            label="Statistical"
            icon="📊"
            active={activeTab === 'enter'}
            onPress={() => setActiveTab('enter')}
          />
          <BottomNavItem
            label="Individual"
            icon="👤"
            active={activeTab === 'profile'}
            onPress={() => setActiveTab('profile')}
          />
        </View>

        <View style={styles.bottomIndicatorBg}>
          <View style={styles.bottomIndicatorFill} />
        </View>
      </View>
    </SafeAreaView>
  );
};

interface BottomNavItemProps {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({
  label,
  icon,
  active,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.bottomNavItem}
      activeOpacity={0.8}
      onPress={onPress}>
      <Text style={[styles.bottomNavIcon, active && styles.bottomNavIconActive]}>
        {icon}
      </Text>
      <Text
        style={[
          styles.bottomNavLabel,
          active ? styles.bottomNavLabelActive : styles.bottomNavLabelInactive,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ========= REV / EXP TAB =========

const INITIAL_EXP_CATEGORIES: Category[] = [
  {id: 'market', name: 'Market', icon: '🛒', color: '#FF6B6B'},
  {id: 'eat', name: 'Eat and drink', icon: '🍽', color: '#FFA94D'},
  {id: 'shopping', name: 'Shopping', icon: '🛍', color: '#845EF7'},
  {id: 'gas', name: 'Gasoline', icon: '⛽', color: '#20C997'},
  {id: 'house', name: 'House', icon: '🏠', color: '#4DABF7'},
  {id: 'electric', name: 'Electricity', icon: '💡', color: '#FCC419'},
];

const INITIAL_REV_CATEGORIES: Category[] = [
  {id: 'salary', name: 'Salary', icon: '💰', color: '#51CF66'},
  {id: 'allowance', name: 'Allowance', icon: '🎁', color: '#FF922B'},
  {id: 'bonus', name: 'Bonus', icon: '✨', color: '#9775FA'},
  {id: 'invest', name: 'Invest', icon: '📈', color: '#0CA678'},
  {id: 'extra', name: 'External income', icon: '💵', color: '#4DABF7'},
];

const ICON_OPTIONS = [
  '🛒',
  '🍽',
  '🛍',
  '⛽',
  '🏠',
  '💡',
  '💰',
  '🎁',
  '✨',
  '📈',
  '💵',
  '📱',
];

const COLOR_OPTIONS = [
  '#FF6B6B',
  '#FFA94D',
  '#FCC419',
  '#51CF66',
  '#20C997',
  '#4DABF7',
  '#845EF7',
  '#ADB5BD',
  '#FF8787',
  '#74C0FC',
  '#63E6BE',
  '#D0BFFF',
  '#FFB8B8',
  '#FFED4A',
  '#B2F2BB',
];

interface RevExpProps {
  onAddRecord: (item: RecordItem) => void;
  currencySymbol: string;
}

type RevExpInnerScreen = 'form' | 'manageCategories' | 'addCategory';

const RevExpTab: React.FC<RevExpProps> = ({onAddRecord, currencySymbol}) => {
  const [moneyType, setMoneyType] = useState<MoneyType>('expenditure');

  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string | null>(null);

  const [expCategories, setExpCategories] =
    useState<Category[]>(INITIAL_EXP_CATEGORIES);
  const [revCategories, setRevCategories] =
    useState<Category[]>(INITIAL_REV_CATEGORIES);

  const [innerScreen, setInnerScreen] =
    useState<RevExpInnerScreen>('form');

  // date selector
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // state untuk add category
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState<string | null>(null);

  const currentCategories =
    moneyType === 'expenditure' ? expCategories : revCategories;

  const changeDay = (delta: number) => {
    setCurrentDate(prev => {
      const d = new Date(prev.getTime());
      d.setDate(d.getDate() + delta);
      return d;
    });
  };

  const handleSave = () => {
    if (!amount || !selectedCategoryId) {
      Alert.alert('Failed', 'Please fill amount and select category.');
      return;
    }

    const cat = currentCategories.find(c => c.id === selectedCategoryId);
    if (!cat) {
      Alert.alert('Failed', 'Category not found.');
      return;
    }

    const dateStr = formatDate(currentDate);

    const item: RecordItem = {
      id: Date.now().toString(),
      type: moneyType,
      date: dateStr,
      amount,
      note,
      categoryId: cat.id,
      categoryName: cat.name,
    };

    onAddRecord(item);

    setAmount('');
    setNote('');
    setSelectedCategoryId(null);

    Alert.alert(
      'Successfully',
      moneyType === 'expenditure'
        ? 'Expense saved successfully.'
        : 'Revenue saved successfully.',
    );
  };

  const goToManageCategories = () => {
    setInnerScreen('manageCategories');
  };

  const goBackToForm = () => {
    setInnerScreen('form');
  };

  const goToAddCategory = () => {
    setNewCatName('');
    setNewCatIcon(null);
    setInnerScreen('addCategory');
  };

  const handleSaveCategory = () => {
    if (!newCatName || !newCatIcon) {
      Alert.alert('Failed', 'Please fill name and choose icon.');
      return;
    }

    const randomColor =
      COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)];

    const newCategory: Category = {
      id: `${moneyType}-${Date.now().toString()}`,
      name: newCatName,
      icon: newCatIcon,
      color: randomColor,
    };

    if (moneyType === 'expenditure') {
      setExpCategories(prev => [...prev, newCategory]);
    } else {
      setRevCategories(prev => [...prev, newCategory]);
    }

    Alert.alert('Successfully', 'Category added.');
    setInnerScreen('manageCategories');
  };

  // ====== SUB-SCREEN: MANAGE CATEGORIES ======
  if (innerScreen === 'manageCategories') {
    const list =
      moneyType === 'expenditure' ? expCategories : revCategories;

    return (
      <View style={styles.revexpContainer}>
        <View style={styles.revexpHeaderRow}>
          <TouchableOpacity onPress={goBackToForm}>
            <Text style={styles.backText}>{'‹ Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.revexpTitle}>Costal editing</Text>
          <View style={{width: 40}} />
        </View>

        <SegmentedToggle
          value={moneyType}
          onChange={setMoneyType}
          leftLabel="Expenditure"
          rightLabel="Revenue"
        />

        <ScrollView style={{marginTop: 24}}>
          <TouchableOpacity
            style={styles.addCategoryRow}
            onPress={goToAddCategory}>
            <Text style={styles.addCategoryPlus}>＋</Text>
            <Text style={styles.addCategoryText}>Add category</Text>
          </TouchableOpacity>

          {list.map(cat => (
            <View key={cat.id} style={styles.categoryRow}>
              <View
                style={[
                  styles.categoryIconCircle,
                  {backgroundColor: cat.color},
                ]}>
                <Text style={{fontSize: 18}}>{cat.icon}</Text>
              </View>
              <Text style={styles.categoryRowText}>{cat.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // ====== SUB-SCREEN: ADD CATEGORY ======
  if (innerScreen === 'addCategory') {
    return (
      <View style={styles.revexpContainer}>
        <View style={styles.revexpHeaderRow}>
          <TouchableOpacity onPress={() => setInnerScreen('manageCategories')}>
            <Text style={styles.backText}>{'‹ Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.revexpTitle}>Add category</Text>
          <View style={{width: 40}} />
        </View>

        <ScrollView style={{marginTop: 16}}>
          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the name of the category"
            value={newCatName}
            onChangeText={setNewCatName}
          />

          <Text style={[styles.fieldLabel, {marginTop: 16}]}>Icon</Text>
          <View style={styles.iconGrid}>
            {ICON_OPTIONS.map(icon => {
              const isActive = newCatIcon === icon;
              return (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconCell,
                    isActive && styles.iconCellActive,
                  ]}
                  onPress={() => setNewCatIcon(icon)}>
                  <Text style={{fontSize: 20}}>{icon}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.saveButton, {marginTop: 24}]}
            onPress={handleSaveCategory}
            activeOpacity={0.85}>
            <Text style={styles.saveButtonText}>Save the catalog</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ========== MAIN FORM (EXP / REV) ==========
  return (
    <View style={styles.revexpContainer}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{paddingBottom: 24}}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.revexpTitle}>Rev / Exp</Text>

        <SegmentedToggle
          value={moneyType}
          onChange={val => {
            setMoneyType(val);
            setSelectedCategoryId(null);
          }}
          leftLabel="Expenditure"
          rightLabel="Revenue"
        />

        {/* Time selector dengan panah */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Time</Text>
          <View style={styles.dateRow}>
            <TouchableOpacity
              style={styles.dateArrow}
              onPress={() => changeDay(-1)}>
              <Text style={styles.chevronText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
            <TouchableOpacity
              style={styles.dateArrow}
              onPress={() => changeDay(1)}>
              <Text style={styles.chevronText}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Amount */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Amount</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.textInputInner, {flex: 1}]}
              placeholder="Enter the amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={styles.suffixText}>{currencySymbol}</Text>
          </View>
        </View>

        {/* Note */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Note</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter notes"
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* Category */}
        <View style={[styles.fieldGroup, {marginBottom: 12}]}>
          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Category</Text>
            <TouchableOpacity onPress={goToManageCategories}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoryGrid}>
            {currentCategories.map(cat => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    isSelected && styles.categoryCardActive,
                  ]}
                  onPress={() => setSelectedCategoryId(cat.id)}>
                  <View
                    style={[
                      styles.categoryIconCircle,
                      {backgroundColor: cat.color},
                    ]}>
                    <Text style={{fontSize: 18}}>{cat.icon}</Text>
                  </View>
                  <Text
                    style={[
                      styles.categoryCardText,
                      isSelected && styles.categoryCardTextActive,
                    ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>
            {moneyType === 'expenditure'
              ? 'Save expenses'
              : 'Save the revenue'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Segmented toggle (Expenditure / Revenue)
interface SegmentedProps {
  value: MoneyType;
  onChange: (val: MoneyType) => void;
  leftLabel: string;
  rightLabel: string;
}
const SegmentedToggle: React.FC<SegmentedProps> = ({
  value,
  onChange,
  leftLabel,
  rightLabel,
}) => {
  return (
    <View style={styles.segmentedWrapper}>
      <TouchableOpacity
        style={[
          styles.segmentedItem,
          value === 'expenditure' && styles.segmentedItemActive,
        ]}
        onPress={() => onChange('expenditure')}>
        <Text
          style={[
            styles.segmentedText,
            value === 'expenditure' && styles.segmentedTextActive,
          ]}>
          {leftLabel}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.segmentedItem,
          value === 'revenue' && styles.segmentedItemActive,
        ]}
        onPress={() => onChange('revenue')}>
        <Text
          style={[
            styles.segmentedText,
            value === 'revenue' && styles.segmentedTextActive,
          ]}>
          {rightLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ========= STATISTICS TAB (ENTER) =========

interface StatisticsProps {
  records: RecordItem[];
  currencySymbol: string;
}

type StatsMode = 'month' | 'year';

const StatisticsTab: React.FC<StatisticsProps> = ({
  records,
  currencySymbol,
}) => {
  const now = new Date();
  const [mode, setMode] = useState<StatsMode>('month');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(
    now.getMonth(),
  );
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());

  const changePeriod = (delta: number) => {
    if (mode === 'month') {
      setSelectedMonthIndex(prev => {
        let m = prev + delta;
        let y = selectedYear;
        if (m < 0) {
          m = 11;
          y -= 1;
        } else if (m > 11) {
          m = 0;
          y += 1;
        }
        setSelectedYear(y);
        return m;
      });
    } else {
      setSelectedYear(prev => prev + delta);
    }
  };

  const periodLabel =
    mode === 'month'
      ? `${MONTHS[selectedMonthIndex]} ${selectedYear}`
      : `${selectedYear}`;

  // hitung total & per kategori (expenditure)
  let totalExp = 0;
  let totalRev = 0;
  const expByCategory: {[name: string]: number} = {};

  records.forEach(r => {
    const {monthIndex, year} = parseMonthYear(r.date);
    if (mode === 'month') {
      if (monthIndex !== selectedMonthIndex || year !== selectedYear) {
        return;
      }
    } else {
      if (year !== selectedYear) {
        return;
      }
    }

    const num = parseAmountToNumber(r.amount);
    if (r.type === 'expenditure') {
      totalExp += num;
      expByCategory[r.categoryName] =
        (expByCategory[r.categoryName] || 0) + num;
    } else {
      totalRev += num;
    }
  });

  const remaining = totalRev - totalExp;

  const categoryList = Object.entries(expByCategory).sort(
    (a, b) => b[1] - a[1],
  );

  const formatMoney = (v: number) =>
    `${currencySymbol} ${v.toLocaleString('id-ID')}`;

  return (
    <View style={styles.revexpContainer}>
      <Text style={styles.revexpTitle}>Statistical</Text>

      {/* Month / Year toggle */}
      <View style={styles.segmentedWrapper}>
        <TouchableOpacity
          style={[
            styles.segmentedItem,
            mode === 'month' && styles.segmentedItemActive,
          ]}
          onPress={() => setMode('month')}>
          <Text
            style={[
              styles.segmentedText,
              mode === 'month' && styles.segmentedTextActive,
            ]}>
            Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentedItem,
            mode === 'year' && styles.segmentedItemActive,
          ]}
          onPress={() => setMode('year')}>
          <Text
            style={[
              styles.segmentedText,
              mode === 'year' && styles.segmentedTextActive,
            ]}>
            Year
          </Text>
        </TouchableOpacity>
      </View>

      {/* Period selector */}
      <View style={[styles.fieldGroup, {marginTop: 16}]}>
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.dateArrow}
            onPress={() => changePeriod(-1)}>
            <Text style={styles.chevronText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>{periodLabel}</Text>
          <TouchableOpacity
            style={styles.dateArrow}
            onPress={() => changePeriod(1)}>
            <Text style={styles.chevronText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* summary cards */}
      <View style={{marginTop: 16}}>
        <Text style={styles.fieldLabel}>Total revenue</Text>
        <Text style={{color: '#22c55e', fontWeight: '700', fontSize: 16}}>
          {formatMoney(totalRev)}
        </Text>
        <Text
          style={[styles.fieldLabel, {marginTop: 8}]}>
          Total expenditure
        </Text>
        <Text style={{color: '#ef4444', fontWeight: '700', fontSize: 16}}>
          {formatMoney(totalExp)}
        </Text>
        <Text
          style={[styles.fieldLabel, {marginTop: 8}]}>
          Remaining
        </Text>
        <Text
          style={{
            color: remaining >= 0 ? '#22c55e' : '#ef4444',
            fontWeight: '700',
            fontSize: 16,
          }}>
          {formatMoney(remaining)}
        </Text>
      </View>

      {/* donut sederhana */}
      <View
        style={{
          marginTop: 24,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.donutOuter}>
          <View style={styles.donutInner}>
            <Text style={{fontSize: 12, color: '#6b7280'}}>
              Total expenditure
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: '#111827',
                marginTop: 4,
              }}>
              {formatMoney(totalExp)}
            </Text>
          </View>
        </View>
      </View>

      {/* list kategori */}
      <ScrollView style={{marginTop: 16}}>
        {categoryList.map(([name, value]) => {
          const percent =
            totalExp > 0 ? ((value / totalExp) * 100).toFixed(1) : '0.0';
          return (
            <View
              key={name}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 6,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#6366f1',
                    marginRight: 8,
                  }}
                />
                <Text style={{fontSize: 14, color: '#111827'}}>{name}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#6b7280',
                    marginLeft: 6,
                  }}>
                  {percent}%
                </Text>
              </View>
              <Text style={{fontSize: 14, color: '#ef4444'}}>
                -{formatMoney(value)}
              </Text>
            </View>
          );
        })}
        {categoryList.length === 0 && (
          <View style={{marginTop: 12}}>
            <Text style={styles.mainSubtitle}>
              Belum ada data untuk periode ini.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// ========= INDIVIDUAL TAB =========

interface IndividualProps {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  name: string;
  setName: (s: string) => void;
  avatar: string;
  onChangeAvatar: () => void;
}

const IndividualTab: React.FC<IndividualProps> = ({
  currency,
  setCurrency,
  name,
  setName,
  avatar,
  onChangeAvatar,
}) => {
  return (
    <View style={styles.revexpContainer}>
      <Text style={styles.revexpTitle}>Individual</Text>

      <View style={{alignItems: 'center', marginTop: 8}}>
        <TouchableOpacity
          style={styles.avatarCircle}
          onPress={onChangeAvatar}
          activeOpacity={0.8}>
          <Text style={{fontSize: 40}}>{avatar}</Text>
        </TouchableOpacity>
        <Text style={{fontSize: 12, color: '#6b7280', marginTop: 4}}>
          Tap to change avatar
        </Text>
      </View>

      <View style={[styles.fieldGroup, {marginTop: 24}]}>
        <Text style={styles.fieldLabel}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={[styles.fieldGroup, {marginTop: 16}]}>
        <Text style={styles.fieldLabel}>Currency</Text>
        <View style={{flexDirection: 'row', marginTop: 8}}>
          {(['IDR', 'USD', 'INR'] as CurrencyCode[]).map(code => {
            const active = currency === code;
            return (
              <TouchableOpacity
                key={code}
                style={[
                  styles.currencyChip,
                  active && styles.currencyChipActive,
                ]}
                onPress={() => setCurrency(code)}>
                <Text
                  style={[
                    styles.currencyChipText,
                    active && styles.currencyChipTextActive,
                  ]}>
                  {CURRENCY_SYMBOLS[code]} {code}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// ========= STYLES =========

const styles = StyleSheet.create({
  // splash
  splashContainer: {
    flex: 1,
    backgroundColor: '#3B2DFF',
  },
  splashContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashIcon: {
    width: 160,
    height: 160,
  },
  splashBottomBarWrapper: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  splashBottomBar: {
    width: 120,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'white',
    opacity: 0.9,
  },

  // onboarding
  onboardingContainer: {
    flex: 1,
    backgroundColor: '#F3F5FF',
  },
  onboardingContent: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconWrapper: {
    marginBottom: 24,
  },
  appIcon: {
    width: 140,
    height: 140,
    borderRadius: 32,
    backgroundColor: '#3B2DFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 6},
    shadowRadius: 12,
    elevation: 8,
  },
  appIconImage: {
    width: 90,
    height: 90,
  },
  appName: {
    fontSize: 16,
    color: '#7B4CFF',
    marginBottom: 8,
    fontWeight: '600',
  },
  appDescription: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111111',
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: '#3B2DFF',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  primaryButtonArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  // main
  mainContainer: {
    flex: 1,
    backgroundColor: '#F3F5FF',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },

  // bottom nav
  bottomNavWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: -2},
    shadowRadius: 8,
    elevation: 8,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
  },
  bottomNavIcon: {
    fontSize: 22,
    color: '#B3B7C3',
    marginBottom: 4,
  },
  bottomNavIconActive: {
    color: '#3B2DFF',
  },
  bottomNavLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  bottomNavLabelActive: {
    color: '#3B2DFF',
  },
  bottomNavLabelInactive: {
    color: '#B3B7C3',
  },
  bottomIndicatorBg: {
    marginTop: 10,
    alignSelf: 'center',
    width: '40%',
    height: 4,
    borderRadius: 999,
    backgroundColor: '#E3E6EF',
  },
  bottomIndicatorFill: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: '#D5D8E5',
  },

  // Rev/Exp & common
  revexpContainer: {
    flex: 1,
    backgroundColor: '#F3F5FF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  revexpTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 16,
  },
  segmentedWrapper: {
    flexDirection: 'row',
    backgroundColor: '#ECECFF',
    borderRadius: 24,
    padding: 4,
  },
  segmentedItem: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentedItemActive: {
    backgroundColor: '#3B2DFF',
  },
  segmentedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C9A',
  },
  segmentedTextActive: {
    color: '#FFFFFF',
  },

  fieldGroup: {
    marginTop: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C9A',
    marginBottom: 6,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: '#111111',
  },
  chevronText: {
    fontSize: 20,
    color: '#B3B7C3',
  },
  textInputInner: {
    fontSize: 15,
  },
  suffixText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B3B7C3',
    marginLeft: 8,
  },
  editText: {
    fontSize: 14,
    color: '#3B2DFF',
    fontWeight: '600',
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryCard: {
    width: '30%',
    marginRight: '3.333%',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  categoryCardActive: {
    borderColor: '#3B2DFF',
  },
  categoryIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryCardText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  categoryCardTextActive: {
    color: '#3B2DFF',
    fontWeight: '600',
  },

  saveButton: {
    marginTop: 16,
    backgroundColor: '#3B2DFF',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // header manage / add category
  revexpHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backText: {
    fontSize: 16,
    color: '#3B2DFF',
    fontWeight: '600',
  },
  addCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  addCategoryPlus: {
    fontSize: 22,
    color: '#3B2DFF',
    marginRight: 6,
  },
  addCategoryText: {
    fontSize: 15,
    color: '#3B2DFF',
    fontWeight: '600',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  categoryRowText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#111111',
  },

  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  iconCell: {
    width: '18%',
    margin: '1%',
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCellActive: {
    borderWidth: 2,
    borderColor: '#3B2DFF',
  },

  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  colorCell: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  colorCellActive: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  // date row
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  dateArrow: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },

  // donut
  donutOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // avatar & currency
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyChip: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  currencyChipActive: {
    backgroundColor: '#3B2DFF',
    borderColor: '#3B2DFF',
  },
  currencyChipText: {
    fontSize: 13,
    color: '#374151',
  },
  currencyChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Enter tab records (dipakai di pesan kosong)
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  recordTypeText: {
    fontSize: 12,
    color: '#7F8C9A',
  },
  recordAmountText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginTop: 2,
  },
  recordCategoryText: {
    fontSize: 14,
    color: '#3B2DFF',
    marginTop: 4,
  },
  recordMetaText: {
    fontSize: 12,
    color: '#7F8C9A',
    marginTop: 2,
  },
});

export default App;