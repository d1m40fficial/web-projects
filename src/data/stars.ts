/**
 * Bright-star catalogue (J2000). RA is in hours, Dec in degrees.
 * Magnitudes and B−V colours are rounded from public catalogues; positions are
 * good enough for a naked-eye planetarium (≈0.1°), not for astrometry.
 */
export interface Star {
  id: string;
  name: string;
  desig?: string;
  ra: number;
  dec: number;
  mag: number;
  bv: number;
  con: string;
}

export const stars: Star[] = [
  { id: 'sirius', name: 'Сириус', desig: 'α CMa', ra: 6.7525, dec: -16.716, mag: -1.46, bv: 0.0, con: 'CMa' },
  { id: 'canopus', name: 'Канопус', desig: 'α Car', ra: 6.3992, dec: -52.696, mag: -0.74, bv: 0.15, con: 'Car' },
  { id: 'arcturus', name: 'Арктур', desig: 'α Boo', ra: 14.261, dec: 19.182, mag: -0.05, bv: 1.23, con: 'Boo' },
  { id: 'vega', name: 'Вега', desig: 'α Lyr', ra: 18.6156, dec: 38.783, mag: 0.03, bv: 0.0, con: 'Lyr' },
  { id: 'capella', name: 'Капелла', desig: 'α Aur', ra: 5.2782, dec: 45.998, mag: 0.08, bv: 0.8, con: 'Aur' },
  { id: 'rigel', name: 'Ригель', desig: 'β Ori', ra: 5.2423, dec: -8.202, mag: 0.13, bv: -0.03, con: 'Ori' },
  { id: 'procyon', name: 'Процион', desig: 'α CMi', ra: 7.6551, dec: 5.225, mag: 0.34, bv: 0.42, con: 'CMi' },
  { id: 'achernar', name: 'Ахернар', desig: 'α Eri', ra: 1.6286, dec: -57.237, mag: 0.46, bv: -0.16, con: 'Eri' },
  { id: 'betelgeuse', name: 'Бетельгейзе', desig: 'α Ori', ra: 5.9195, dec: 7.407, mag: 0.5, bv: 1.85, con: 'Ori' },
  { id: 'hadar', name: 'Хадар', desig: 'β Cen', ra: 14.0637, dec: -60.373, mag: 0.61, bv: -0.23, con: 'Cen' },
  { id: 'altair', name: 'Альтаир', desig: 'α Aql', ra: 19.8464, dec: 8.868, mag: 0.77, bv: 0.22, con: 'Aql' },
  { id: 'acrux', name: 'Акрукс', desig: 'α Cru', ra: 12.4433, dec: -63.099, mag: 0.76, bv: -0.24, con: 'Cru' },
  { id: 'aldebaran', name: 'Альдебаран', desig: 'α Tau', ra: 4.5987, dec: 16.509, mag: 0.86, bv: 1.54, con: 'Tau' },
  { id: 'antares', name: 'Антарес', desig: 'α Sco', ra: 16.4901, dec: -26.432, mag: 1.06, bv: 1.83, con: 'Sco' },
  { id: 'spica', name: 'Спика', desig: 'α Vir', ra: 13.4199, dec: -11.161, mag: 0.98, bv: -0.23, con: 'Vir' },
  { id: 'pollux', name: 'Поллукс', desig: 'β Gem', ra: 7.7553, dec: 28.026, mag: 1.14, bv: 1.0, con: 'Gem' },
  { id: 'fomalhaut', name: 'Фомальгаут', desig: 'α PsA', ra: 22.9608, dec: -29.622, mag: 1.16, bv: 0.09, con: 'PsA' },
  { id: 'deneb', name: 'Денеб', desig: 'α Cyg', ra: 20.6905, dec: 45.28, mag: 1.25, bv: 0.09, con: 'Cyg' },
  { id: 'mimosa', name: 'Мимоза', desig: 'β Cru', ra: 12.7953, dec: -59.689, mag: 1.25, bv: -0.23, con: 'Cru' },
  { id: 'regulus', name: 'Регул', desig: 'α Leo', ra: 10.1395, dec: 11.967, mag: 1.35, bv: -0.11, con: 'Leo' },
  { id: 'adhara', name: 'Адара', desig: 'ε CMa', ra: 6.9771, dec: -28.972, mag: 1.5, bv: -0.21, con: 'CMa' },
  { id: 'castor', name: 'Кастор', desig: 'α Gem', ra: 7.5767, dec: 31.888, mag: 1.58, bv: 0.03, con: 'Gem' },
  { id: 'gacrux', name: 'Гакрукс', desig: 'γ Cru', ra: 12.5194, dec: -57.113, mag: 1.59, bv: 1.59, con: 'Cru' },
  { id: 'shaula', name: 'Шаула', desig: 'λ Sco', ra: 17.5601, dec: -37.104, mag: 1.62, bv: -0.22, con: 'Sco' },
  { id: 'bellatrix', name: 'Беллятрикс', desig: 'γ Ori', ra: 5.4188, dec: 6.35, mag: 1.64, bv: -0.22, con: 'Ori' },
  { id: 'elnath', name: 'Эльнат', desig: 'β Tau', ra: 5.4382, dec: 28.608, mag: 1.65, bv: -0.13, con: 'Tau' },
  { id: 'miaplacidus', name: 'Миаплацидус', desig: 'β Car', ra: 9.22, dec: -69.717, mag: 1.67, bv: 0.07, con: 'Car' },
  { id: 'alnilam', name: 'Альнилам', desig: 'ε Ori', ra: 5.6036, dec: -1.202, mag: 1.69, bv: -0.18, con: 'Ori' },
  { id: 'alnair', name: 'Альнаир', desig: 'α Gru', ra: 22.1372, dec: -46.961, mag: 1.73, bv: -0.13, con: 'Gru' },
  { id: 'alnitak', name: 'Альнитак', desig: 'ζ Ori', ra: 5.6793, dec: -1.943, mag: 1.77, bv: -0.21, con: 'Ori' },
  { id: 'alioth', name: 'Алиот', desig: 'ε UMa', ra: 12.9004, dec: 55.96, mag: 1.76, bv: -0.02, con: 'UMa' },
  { id: 'dubhe', name: 'Дубхе', desig: 'α UMa', ra: 11.0621, dec: 61.751, mag: 1.79, bv: 1.07, con: 'UMa' },
  { id: 'mirfak', name: 'Мирфак', desig: 'α Per', ra: 3.4054, dec: 49.861, mag: 1.79, bv: 0.48, con: 'Per' },
  { id: 'wezen', name: 'Везен', desig: 'δ CMa', ra: 7.1399, dec: -26.393, mag: 1.83, bv: 0.67, con: 'CMa' },
  { id: 'sargas', name: 'Саргас', desig: 'θ Sco', ra: 17.6219, dec: -42.998, mag: 1.86, bv: 0.4, con: 'Sco' },
  { id: 'kaus_australis', name: 'Каус Аустралис', desig: 'ε Sgr', ra: 18.4029, dec: -34.385, mag: 1.85, bv: -0.13, con: 'Sgr' },
  { id: 'avior', name: 'Авиор', desig: 'ε Car', ra: 8.3752, dec: -59.51, mag: 1.86, bv: 1.28, con: 'Car' },
  { id: 'alkaid', name: 'Алькаид', desig: 'η UMa', ra: 13.7923, dec: 49.313, mag: 1.85, bv: -0.19, con: 'UMa' },
  { id: 'menkalinan', name: 'Менкалинан', desig: 'β Aur', ra: 5.9921, dec: 44.947, mag: 1.9, bv: 0.08, con: 'Aur' },
  { id: 'atria', name: 'Атрия', desig: 'α TrA', ra: 16.8111, dec: -69.028, mag: 1.91, bv: 1.44, con: 'TrA' },
  { id: 'alhena', name: 'Альхена', desig: 'γ Gem', ra: 6.6285, dec: 16.399, mag: 1.93, bv: 0.0, con: 'Gem' },
  { id: 'peacock', name: 'Павлин', desig: 'α Pav', ra: 20.4275, dec: -56.735, mag: 1.94, bv: -0.12, con: 'Pav' },
  { id: 'alsephina', name: 'Альсефина', desig: 'δ Vel', ra: 8.7451, dec: -54.709, mag: 1.96, bv: 0.04, con: 'Vel' },
  { id: 'mirzam', name: 'Мирзам', desig: 'β CMa', ra: 6.3783, dec: -17.956, mag: 1.98, bv: -0.23, con: 'CMa' },
  { id: 'alphard', name: 'Альфард', desig: 'α Hya', ra: 9.4597, dec: -8.659, mag: 1.98, bv: 1.44, con: 'Hya' },
  { id: 'polaris', name: 'Полярная', desig: 'α UMi', ra: 2.5303, dec: 89.264, mag: 1.98, bv: 0.6, con: 'UMi' },
  { id: 'hamal', name: 'Гамаль', desig: 'α Ari', ra: 2.1196, dec: 23.463, mag: 2.0, bv: 1.15, con: 'Ari' },
  { id: 'algieba', name: 'Альгиеба', desig: 'γ Leo', ra: 10.3328, dec: 19.841, mag: 2.01, bv: 1.13, con: 'Leo' },
  { id: 'diphda', name: 'Дифда', desig: 'β Cet', ra: 0.7264, dec: -17.987, mag: 2.02, bv: 1.02, con: 'Cet' },
  { id: 'mizar', name: 'Мицар', desig: 'ζ UMa', ra: 13.3988, dec: 54.925, mag: 2.04, bv: 0.02, con: 'UMa' },
  { id: 'nunki', name: 'Нунки', desig: 'σ Sgr', ra: 18.9211, dec: -26.297, mag: 2.05, bv: -0.13, con: 'Sgr' },
  { id: 'menkent', name: 'Менкент', desig: 'θ Cen', ra: 14.1115, dec: -36.37, mag: 2.06, bv: 1.01, con: 'Cen' },
  { id: 'alpheratz', name: 'Альферац', desig: 'α And', ra: 0.1398, dec: 29.09, mag: 2.06, bv: -0.11, con: 'And' },
  { id: 'mirach', name: 'Мирах', desig: 'β And', ra: 1.1622, dec: 35.62, mag: 2.06, bv: 1.58, con: 'And' },
  { id: 'saiph', name: 'Сайф', desig: 'κ Ori', ra: 5.7959, dec: -9.67, mag: 2.07, bv: -0.17, con: 'Ori' },
  { id: 'kochab', name: 'Кохаб', desig: 'β UMi', ra: 14.8451, dec: 74.156, mag: 2.08, bv: 1.47, con: 'UMi' },
  { id: 'rasalhague', name: 'Расальхаг', desig: 'α Oph', ra: 17.5822, dec: 12.56, mag: 2.08, bv: 0.15, con: 'Oph' },
  { id: 'algol', name: 'Алголь', desig: 'β Per', ra: 3.1361, dec: 40.956, mag: 2.12, bv: -0.05, con: 'Per' },
  { id: 'denebola', name: 'Денебола', desig: 'β Leo', ra: 11.8177, dec: 14.572, mag: 2.14, bv: 0.09, con: 'Leo' },
  { id: 'gamma_cas', name: 'Нави', desig: 'γ Cas', ra: 0.9451, dec: 60.717, mag: 2.15, bv: -0.15, con: 'Cas' },
  { id: 'schedar', name: 'Шедар', desig: 'α Cas', ra: 0.6751, dec: 56.537, mag: 2.24, bv: 1.17, con: 'Cas' },
  { id: 'caph', name: 'Каф', desig: 'β Cas', ra: 0.1529, dec: 59.15, mag: 2.27, bv: 0.34, con: 'Cas' },
  { id: 'sadr', name: 'Садр', desig: 'γ Cyg', ra: 20.3705, dec: 40.256, mag: 2.23, bv: 0.68, con: 'Cyg' },
  { id: 'eltanin', name: 'Эльтанин', desig: 'γ Dra', ra: 17.9434, dec: 51.489, mag: 2.24, bv: 1.52, con: 'Dra' },
  { id: 'enif', name: 'Эниф', desig: 'ε Peg', ra: 21.7364, dec: 9.875, mag: 2.39, bv: 1.52, con: 'Peg' },
  { id: 'markab', name: 'Маркаб', desig: 'α Peg', ra: 23.0794, dec: 15.205, mag: 2.48, bv: -0.04, con: 'Peg' },
  { id: 'scheat', name: 'Шеат', desig: 'β Peg', ra: 23.0629, dec: 28.082, mag: 2.44, bv: 1.67, con: 'Peg' },
  { id: 'algenib', name: 'Альгениб', desig: 'γ Peg', ra: 0.2206, dec: 15.184, mag: 2.83, bv: -0.23, con: 'Peg' },
  { id: 'merak', name: 'Мерак', desig: 'β UMa', ra: 11.0307, dec: 56.383, mag: 2.37, bv: 0.03, con: 'UMa' },
  { id: 'phecda', name: 'Фекда', desig: 'γ UMa', ra: 11.8972, dec: 53.695, mag: 2.44, bv: 0.04, con: 'UMa' },
  { id: 'megrez', name: 'Мегрец', desig: 'δ UMa', ra: 12.257, dec: 57.033, mag: 3.31, bv: 0.08, con: 'UMa' },
  { id: 'alcor', name: 'Алькор', desig: '80 UMa', ra: 13.4205, dec: 54.988, mag: 3.99, bv: 0.16, con: 'UMa' },
  { id: 'gienah_cyg', name: 'Дженах', desig: 'ε Cyg', ra: 20.7702, dec: 33.97, mag: 2.46, bv: 1.03, con: 'Cyg' },
  { id: 'albireo', name: 'Альбирео', desig: 'β Cyg', ra: 19.5121, dec: 27.96, mag: 3.18, bv: 0.93, con: 'Cyg' },
  { id: 'delta_cyg', name: 'Фаварис', desig: 'δ Cyg', ra: 19.7495, dec: 45.131, mag: 2.87, bv: 0.0, con: 'Cyg' },
  { id: 'ruchbah', name: 'Рукбах', desig: 'δ Cas', ra: 1.4303, dec: 60.235, mag: 2.68, bv: 0.13, con: 'Cas' },
  { id: 'eps_cas', name: 'Сегин', desig: 'ε Cas', ra: 1.9066, dec: 63.67, mag: 3.38, bv: 0.68, con: 'Cas' },
  { id: 'gamma_per', name: 'Гамма Персея', desig: 'γ Per', ra: 3.0798, dec: 53.506, mag: 2.93, bv: 0.7, con: 'Per' },
  { id: 'epsilon_per', name: 'Эпсилон Персея', desig: 'ε Per', ra: 3.9642, dec: 40.01, mag: 2.9, bv: -0.2, con: 'Per' },
  { id: 'rastaban', name: 'Растабан', desig: 'β Dra', ra: 17.5072, dec: 52.301, mag: 2.79, bv: 0.95, con: 'Dra' },
  { id: 'edasich', name: 'Эдасих', desig: 'ι Dra', ra: 15.4155, dec: 58.966, mag: 3.29, bv: 1.16, con: 'Dra' },
  { id: 'vindemiatrix', name: 'Виндемиатрикс', desig: 'ε Vir', ra: 13.0363, dec: 10.959, mag: 2.85, bv: 0.94, con: 'Vir' },
  { id: 'zavijava', name: 'Завиява', desig: 'β Vir', ra: 11.8449, dec: 1.765, mag: 3.61, bv: 0.52, con: 'Vir' },
  { id: 'porrima', name: 'Поррима', desig: 'γ Vir', ra: 12.6943, dec: -1.449, mag: 2.74, bv: 0.36, con: 'Vir' },
  { id: 'zubenelgenubi', name: 'Зубенельгенуби', desig: 'α Lib', ra: 14.8479, dec: -16.042, mag: 2.75, bv: 0.15, con: 'Lib' },
  { id: 'zubeneschamali', name: 'Зубенешамали', desig: 'β Lib', ra: 15.2834, dec: -9.383, mag: 2.61, bv: -0.07, con: 'Lib' },
  { id: 'unukalhai', name: 'Унукальхай', desig: 'α Ser', ra: 15.7377, dec: 6.425, mag: 2.63, bv: 1.17, con: 'Ser' },
  { id: 'rasalgethi', name: 'Рас Альгети', desig: 'α Her', ra: 17.2441, dec: 14.39, mag: 3.48, bv: 1.44, con: 'Her' },
  { id: 'kornephoros', name: 'Корнефорос', desig: 'β Her', ra: 16.5036, dec: 31.603, mag: 2.78, bv: 0.94, con: 'Her' },
  { id: 'alderamin', name: 'Альдерамин', desig: 'α Cep', ra: 21.3096, dec: 62.586, mag: 2.45, bv: 0.22, con: 'Cep' },
  { id: 'alfirk', name: 'Альфирк', desig: 'β Cep', ra: 21.4776, dec: 70.561, mag: 3.23, bv: -0.22, con: 'Cep' },
  { id: 'errai', name: 'Эррай', desig: 'γ Cep', ra: 23.6558, dec: 77.632, mag: 3.21, bv: 1.03, con: 'Cep' },
  { id: 'alpherg', name: 'Альферг', desig: 'η Psc', ra: 1.5248, dec: 15.346, mag: 3.62, bv: 0.9, con: 'Psc' },
  { id: 'acamar', name: 'Акамар', desig: 'θ Eri', ra: 2.9711, dec: -40.305, mag: 2.88, bv: 0.13, con: 'Eri' },
  { id: 'zeta_cen', name: 'Зета Центавра', desig: 'ζ Cen', ra: 13.9257, dec: -47.288, mag: 2.55, bv: -0.22, con: 'Cen' },
  { id: 'epsilon_cen', name: 'Эпсилон Центавра', desig: 'ε Cen', ra: 13.6648, dec: -53.466, mag: 2.3, bv: -0.23, con: 'Cen' },
  { id: 'eta_cen', name: 'Эта Центавра', desig: 'η Cen', ra: 14.5927, dec: -42.158, mag: 2.31, bv: 1.24, con: 'Cen' },
  { id: 'alpha_cen', name: 'Толиман', desig: 'α Cen', ra: 14.6601, dec: -60.835, mag: -0.27, bv: 0.71, con: 'Cen' },
  { id: 'delta_cru', name: 'Дельта Южного Креста', desig: 'δ Cru', ra: 12.2524, dec: -58.749, mag: 2.79, bv: 1.66, con: 'Cru' },
  { id: 'epsilon_cru', name: 'Эпсилон Южного Креста', desig: 'ε Cru', ra: 12.3564, dec: -60.401, mag: 3.59, bv: 0.15, con: 'Cru' },
  { id: 'alpha_cir', name: 'Альфа Циркуля', desig: 'α Cir', ra: 14.7085, dec: -64.975, mag: 3.19, bv: 1.18, con: 'Cir' },
  { id: 'epsilon_sco', name: 'Эпсилон Скорпиона', desig: 'ε Sco', ra: 16.8361, dec: -34.293, mag: 2.29, bv: 1.15, con: 'Sco' },
  { id: 'delta_ori', name: 'Минтака', desig: 'δ Ori', ra: 5.5334, dec: -0.299, mag: 2.25, bv: -0.22, con: 'Ori' },
  { id: 'iota_ori', name: 'Йота Ориона', desig: 'ι Ori', ra: 5.5905, dec: -5.91, mag: 2.77, bv: -0.24, con: 'Ori' },
  { id: 'meissa', name: 'Мейсса', desig: 'λ Ori', ra: 5.5855, dec: 9.934, mag: 3.39, bv: -0.2, con: 'Ori' },
  { id: 'tarazed', name: 'Таразад', desig: 'γ Aql', ra: 19.771, dec: 10.613, mag: 2.72, bv: 1.02, con: 'Aql' },
  { id: 'alshain', name: 'Альшаин', desig: 'β Aql', ra: 19.9219, dec: 6.407, mag: 3.71, bv: 0.86, con: 'Aql' },
  { id: 'sulafat', name: 'Сулафат', desig: 'γ Lyr', ra: 18.9824, dec: 32.69, mag: 3.25, bv: 0.0, con: 'Lyr' },
  { id: 'sheliak', name: 'Шелиак', desig: 'β Lyr', ra: 18.8347, dec: 33.363, mag: 3.52, bv: 0.0, con: 'Lyr' },
  { id: 'zosma', name: 'Зосма', desig: 'δ Leo', ra: 11.2351, dec: 20.524, mag: 2.56, bv: 0.13, con: 'Leo' },
  { id: 'mebsuta', name: 'Мебсута', desig: 'ε Gem', ra: 6.7323, dec: 25.131, mag: 3.06, bv: 0.99, con: 'Gem' },
  { id: 'wasat', name: 'Васат', desig: 'δ Gem', ra: 7.3353, dec: 21.982, mag: 3.53, bv: 0.35, con: 'Gem' },
  { id: 'epsilon_tau', name: 'Эпсилон Тельца', desig: 'ε Tau', ra: 4.4767, dec: 19.18, mag: 3.53, bv: 1.01, con: 'Tau' },
  { id: 'gomeisa', name: 'Гомейза', desig: 'β CMi', ra: 7.4525, dec: 8.289, mag: 2.89, bv: 0.09, con: 'CMi' },
  { id: 'lesath', name: 'Лесат', desig: 'υ Sco', ra: 17.5126, dec: -37.296, mag: 2.69, bv: -0.22, con: 'Sco' },
  { id: 'dschubba', name: 'Дшубба', desig: 'δ Sco', ra: 16.0056, dec: -22.622, mag: 2.32, bv: -0.11, con: 'Sco' },
  { id: 'acrab', name: 'Акраб', desig: 'β Sco', ra: 16.0906, dec: -19.805, mag: 2.56, bv: -0.07, con: 'Sco' },
  { id: 'almach', name: 'Альмах', desig: 'γ And', ra: 2.0649, dec: 42.33, mag: 2.1, bv: 1.37, con: 'And' },
  { id: 'seginus', name: 'Сегинус', desig: 'γ Boo', ra: 14.5346, dec: 38.308, mag: 3.03, bv: 0.19, con: 'Boo' },
  { id: 'nekkar', name: 'Неккар', desig: 'β Boo', ra: 15.0324, dec: 40.39, mag: 3.49, bv: 0.97, con: 'Boo' },
  { id: 'muphrid', name: 'Муфрид', desig: 'η Boo', ra: 13.9114, dec: 18.398, mag: 2.68, bv: 0.58, con: 'Boo' },
  { id: 'eps_umi', name: 'Эпсилон Малой Медведицы', desig: 'ε UMi', ra: 16.7661, dec: 82.037, mag: 4.21, bv: 0.9, con: 'UMi' },
  { id: 'zeta_umi', name: 'Зета Малой Медведицы', desig: 'ζ UMi', ra: 15.7345, dec: 77.794, mag: 4.29, bv: 0.83, con: 'UMi' },
  { id: 'eta_umi', name: 'Эта Малой Медведицы', desig: 'η UMi', ra: 16.2917, dec: 75.755, mag: 4.95, bv: 0.36, con: 'UMi' },
  { id: 'pherkad', name: 'Феркад', desig: 'γ UMi', ra: 15.3455, dec: 71.834, mag: 3.0, bv: 0.05, con: 'UMi' },
  { id: 'yildun', name: 'Ильдун', desig: 'δ UMi', ra: 17.5369, dec: 86.586, mag: 4.36, bv: 0.02, con: 'UMi' },
  { id: 'aludra', name: 'Алудра', desig: 'η CMa', ra: 7.4015, dec: -29.303, mag: 2.45, bv: -0.21, con: 'CMa' },
];

export interface Constellation {
  id: string;
  name: string;
  stars: string[];
  lines: [string, string][];
}

export const constellations: Constellation[] = [
  {
    id: 'ori',
    name: 'Орион',
    stars: ['betelgeuse', 'bellatrix', 'meissa', 'alnitak', 'alnilam', 'delta_ori', 'saiph', 'rigel'],
    lines: [
      ['meissa', 'betelgeuse'],
      ['meissa', 'bellatrix'],
      ['bellatrix', 'delta_ori'],
      ['delta_ori', 'alnilam'],
      ['alnilam', 'alnitak'],
      ['alnitak', 'betelgeuse'],
      ['alnitak', 'saiph'],
      ['saiph', 'rigel'],
      ['rigel', 'delta_ori'],
    ],
  },
  {
    id: 'uma',
    name: 'Большая Медведица',
    stars: ['dubhe', 'merak', 'phecda', 'megrez', 'alioth', 'mizar', 'alkaid', 'alcor'],
    lines: [
      ['dubhe', 'merak'],
      ['merak', 'phecda'],
      ['phecda', 'megrez'],
      ['megrez', 'dubhe'],
      ['megrez', 'alioth'],
      ['alioth', 'mizar'],
      ['mizar', 'alkaid'],
    ],
  },
  {
    id: 'umi',
    name: 'Малая Медведица',
    stars: ['polaris', 'yildun', 'eps_umi', 'zeta_umi', 'eta_umi', 'kochab', 'pherkad'],
    lines: [
      ['polaris', 'yildun'],
      ['yildun', 'eps_umi'],
      ['eps_umi', 'zeta_umi'],
      ['zeta_umi', 'eta_umi'],
      ['eta_umi', 'kochab'],
      ['kochab', 'pherkad'],
      ['pherkad', 'zeta_umi'],
    ],
  },
  {
    id: 'cas',
    name: 'Кассиопея',
    stars: ['caph', 'schedar', 'gamma_cas', 'ruchbah', 'eps_cas'],
    lines: [
      ['caph', 'schedar'],
      ['schedar', 'gamma_cas'],
      ['gamma_cas', 'ruchbah'],
      ['ruchbah', 'eps_cas'],
    ],
  },
  {
    id: 'cyg',
    name: 'Лебедь',
    stars: ['deneb', 'sadr', 'albireo', 'gienah_cyg', 'delta_cyg'],
    lines: [
      ['deneb', 'sadr'],
      ['sadr', 'albireo'],
      ['sadr', 'gienah_cyg'],
      ['sadr', 'delta_cyg'],
    ],
  },
  {
    id: 'lyr',
    name: 'Лира',
    stars: ['vega', 'sheliak', 'sulafat'],
    lines: [
      ['vega', 'sheliak'],
      ['sheliak', 'sulafat'],
      ['sulafat', 'vega'],
    ],
  },
  {
    id: 'aql',
    name: 'Орёл',
    stars: ['altair', 'tarazed', 'alshain'],
    lines: [
      ['altair', 'tarazed'],
      ['altair', 'alshain'],
    ],
  },
  {
    id: 'sco',
    name: 'Скорпион',
    stars: ['acrab', 'dschubba', 'antares', 'epsilon_sco', 'sargas', 'shaula', 'lesath'],
    lines: [
      ['acrab', 'dschubba'],
      ['dschubba', 'antares'],
      ['antares', 'epsilon_sco'],
      ['epsilon_sco', 'sargas'],
      ['sargas', 'shaula'],
      ['shaula', 'lesath'],
    ],
  },
  {
    id: 'leo',
    name: 'Лев',
    stars: ['regulus', 'algieba', 'zosma', 'denebola'],
    lines: [
      ['regulus', 'algieba'],
      ['algieba', 'zosma'],
      ['zosma', 'denebola'],
      ['denebola', 'regulus'],
    ],
  },
  {
    id: 'gem',
    name: 'Близнецы',
    stars: ['castor', 'pollux', 'mebsuta', 'wasat', 'alhena'],
    lines: [
      ['castor', 'pollux'],
      ['castor', 'mebsuta'],
      ['mebsuta', 'wasat'],
      ['wasat', 'alhena'],
      ['pollux', 'alhena'],
    ],
  },
  {
    id: 'tau',
    name: 'Телец',
    stars: ['aldebaran', 'elnath', 'epsilon_tau'],
    lines: [
      ['aldebaran', 'elnath'],
      ['aldebaran', 'epsilon_tau'],
      ['epsilon_tau', 'elnath'],
    ],
  },
  {
    id: 'cma',
    name: 'Большой Пёс',
    stars: ['sirius', 'mirzam', 'adhara', 'wezen', 'aludra'],
    lines: [
      ['sirius', 'mirzam'],
      ['sirius', 'adhara'],
      ['adhara', 'wezen'],
      ['wezen', 'aludra'],
    ],
  },
  {
    id: 'cru',
    name: 'Южный Крест',
    stars: ['acrux', 'gacrux', 'mimosa', 'delta_cru', 'epsilon_cru'],
    lines: [
      ['acrux', 'gacrux'],
      ['mimosa', 'delta_cru'],
    ],
  },
  {
    id: 'cen',
    name: 'Центавр',
    stars: ['alpha_cen', 'hadar', 'epsilon_cen', 'zeta_cen', 'menkent'],
    lines: [
      ['alpha_cen', 'hadar'],
      ['hadar', 'epsilon_cen'],
      ['epsilon_cen', 'zeta_cen'],
    ],
  },
  {
    id: 'boo',
    name: 'Волопас',
    stars: ['arcturus', 'muphrid', 'izar', 'seginus', 'nekkar'],
    lines: [
      ['arcturus', 'muphrid'],
      ['arcturus', 'izar'],
      ['izar', 'nekkar'],
      ['nekkar', 'seginus'],
      ['seginus', 'arcturus'],
    ],
  },
  {
    id: 'aur',
    name: 'Возничий',
    stars: ['capella', 'menkalinan'],
    lines: [['capella', 'menkalinan']],
  },
  {
    id: 'per',
    name: 'Персей',
    stars: ['mirfak', 'algol', 'gamma_per', 'epsilon_per'],
    lines: [
      ['mirfak', 'gamma_per'],
      ['mirfak', 'algol'],
      ['algol', 'epsilon_per'],
    ],
  },
  {
    id: 'peg',
    name: 'Пегас',
    stars: ['markab', 'scheat', 'alpheratz', 'algenib', 'enif'],
    lines: [
      ['markab', 'scheat'],
      ['scheat', 'alpheratz'],
      ['alpheratz', 'algenib'],
      ['algenib', 'markab'],
    ],
  },
  {
    id: 'and',
    name: 'Андромеда',
    stars: ['alpheratz', 'mirach', 'almach'],
    lines: [
      ['alpheratz', 'mirach'],
      ['mirach', 'almach'],
    ],
  },
  {
    id: 'cmi',
    name: 'Малый Пёс',
    stars: ['procyon', 'gomeisa'],
    lines: [['procyon', 'gomeisa']],
  },
  {
    id: 'vir',
    name: 'Дева',
    stars: ['spica', 'porrima', 'vindemiatrix', 'zavijava'],
    lines: [
      ['spica', 'porrima'],
      ['porrima', 'vindemiatrix'],
      ['spica', 'zavijava'],
    ],
  },
  {
    id: 'lib',
    name: 'Весы',
    stars: ['zubenelgenubi', 'zubeneschamali'],
    lines: [['zubenelgenubi', 'zubeneschamali']],
  },
  {
    id: 'her',
    name: 'Геркулес',
    stars: ['rasalgethi', 'kornephoros'],
    lines: [['rasalgethi', 'kornephoros']],
  },
  {
    id: 'cep',
    name: 'Цефей',
    stars: ['alderamin', 'alfirk', 'errai'],
    lines: [
      ['alderamin', 'alfirk'],
      ['alfirk', 'errai'],
    ],
  },
  {
    id: 'dra',
    name: 'Дракон',
    stars: ['eltanin', 'rastaban', 'edasich'],
    lines: [
      ['eltanin', 'rastaban'],
      ['eltanin', 'edasich'],
    ],
  },
];

export const starById = new Map(stars.map((s) => [s.id, s]));

export const starColor = (bv: number): string => {
  if (bv < 0) return '#a9c8ff';
  if (bv < 0.3) return '#d5e4ff';
  if (bv < 0.8) return '#ffffff';
  if (bv < 1.2) return '#ffeed2';
  return '#ffc08f';
};
