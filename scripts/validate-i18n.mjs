import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const content = JSON.parse(fs.readFileSync(new URL('../content.json', import.meta.url), 'utf8'));
const languages = ['vi', 'en'];
const errors = [];
const usedKeys = new Set(['meta.title', 'meta.description']);

for (const match of html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)) {
  usedKeys.add(match[1]);
}

for (const match of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
  for (const binding of match[1].split(';')) {
    const separator = binding.indexOf(':');
    if (separator > 0) usedKeys.add(binding.slice(separator + 1).trim());
  }
}

for (const [key, value] of Object.entries(content)) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${key}: entry must be an object`);
    continue;
  }

  for (const language of languages) {
    if (typeof value[language] !== 'string' || value[language].trim() === '') {
      errors.push(`${key}: missing ${language} value`);
    }
  }

  if (!usedKeys.has(key)) errors.push(`${key}: content key is not used by index.html`);
}

for (const key of usedKeys) {
  if (!content[key]) errors.push(`${key}: key is referenced by index.html but missing from content.json`);
}

const vietnameseDiacritics = /[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/;
const vietnameseWords = /\b(Khung|Kinh doanh|Nền tảng|Giọng điệu|Hướng dẫn|Bảng màu|Dùng|Tránh|Quy tắc|Tổng quan|Nội dung|Đối tác|Tham khảo|Viết kỹ thuật|Câu mẫu|Ngôn ngữ|Tầng)\b/;

for (const [key, value] of Object.entries(content)) {
  if (typeof value.en !== 'string') continue;
  const englishForLanguageCheck = key === 'section.quick-ref'
    ? value.en.replace(/<td>(Kỹ thuật|Có chiều sâu|Thực dụng|Có cấu trúc|Hướng đối tác)<\/td>/g, '')
    : value.en;
  if (vietnameseDiacritics.test(englishForLanguageCheck) || vietnameseWords.test(englishForLanguageCheck)) {
    errors.push(`${key}: English value still appears to contain Vietnamese text`);
  }

  if (!key.startsWith('section.') && !['navigation', 'hero', 'footer'].includes(key)) continue;

  for (const attribute of ['href', 'src', 'data-hex']) {
    const pattern = new RegExp(`${attribute}="([^"]+)"`, 'g');
    const viValues = [...value.vi.matchAll(pattern)].map((match) => match[1]).sort();
    const enValues = [...value.en.matchAll(pattern)].map((match) => match[1]).sort();
    if (JSON.stringify(viValues) !== JSON.stringify(enValues)) {
      errors.push(`${key}: ${attribute} values differ between vi and en`);
    }
  }
}

const sectionKeys = Object.keys(content).filter((key) => key.startsWith('section.'));
const sectionBindings = [...html.matchAll(/data-i18n-html="section\.([^"]+)"/g)];
if (sectionKeys.length !== sectionBindings.length) {
  errors.push(`Section count mismatch: ${sectionKeys.length} content entries, ${sectionBindings.length} HTML bindings`);
}

if (errors.length) {
  console.error(errors.map((error) => `ERROR: ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`i18n valid: ${Object.keys(content).length} keys, ${sectionKeys.length} content sections, ${languages.join('/')} complete`);
}
