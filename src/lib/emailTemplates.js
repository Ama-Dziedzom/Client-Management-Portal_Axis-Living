const STUDIO_NAME = 'Axis Living';
const YOUR_NAME = 'Kas';
const CONTACT_EMAIL = 'hello@axisliving.co.zm';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://axisliving.co.zm';
const LOGO_URI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAACECAYAAACu5qZFAAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAADIAAAAAQAAAMgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAPCgAwAEAAAAAQAAAIQAAAAAOLvCwQAAAAlwSFlzAAAewgAAHsIBbtB1PgAAMgRJREFUeAHtfQl8W8W1t+6i3bIt73YSb4mzQnYSCAkkLAFSlkIbCpS18JGWtkD7XtvX5UG+lvaVR3m0fVAgbeGDljaEUvjYCuWFBLIAIQlZyR47jhPHcWxL1i7d5f3Pla8iOXaIpRvbiufm50i6M3PmzH/mzJyZOXOGq55cnS/ZpYgSVTgTexgCDIGsQIC38KoYEq2mimkVjqzgmDHJEGAIpCBAssunvGE/GAIMgaxCgAlwVlUXY5YhkIoAE+BUPNgvhkBWIcAEOKuqizHLEEhFgAlwKh7sF0MgqxBgApxV1cWYZQikIsAEOBUP9oshkFUIMAHOqupizDIEUhFgApyKB/vFEMgqBJgAZ1V1MWYZAqkIMAFOxYP9YghkFQJMgLOquhizDIFUBJgAp+LBfjEEsgoBMV1uFy9ezD/44IPsCGK6ALJ0Qx0BheM4NVMQ0hbgm266aczBgwcrwYCqCqoi8IJskiXwxPGyzPGmZMoSIgmqxqyMQBGBEv4JeJlSgKQ0+KoiWfzBF0EQVGRgErQ3gknmZA4k4h2IaNLoED2ir+XdLUwnlfikcMqPMunKV0vbFaGLNxUZpvBI+XOcidPKiO9auSQZNLrKkkRPI6XnE6cbp9WdNwk8d5VMixbnB6TjZdbeyeAXvFD+yA1fgQGVNfnpVp5EUBcPenytbF2YJcXRvmo4E7b06HzSd8TX+OmOu1Y3JtRN1wNs9K/ap17+OC6gcTyuVgY9r+REiINCEp3jdaSHd+dbf5/8qfPUhVkiiHjTy6RjRYHJNLv4pQqmAGIbTU/VviQI0TuTIqPQKFCifVC77ulBu03BREBb8bZ59yJuY0/x+/Ku5xxPgUJBYcHPgK8bonqAh8xKsqQKgsPEqRzaGDkH4BMFA2z0HdWimBQkQnw9LKVgerYK4ulxtO8maPqI2fWePokGUQS9rrgqYiRToxw4hZqC9iBf7dHmDPG08fhIpyigxyd46ooPuloO9J5SH+cBP0CB55C3lqMWTytTVzxEIB6JEOVHZe4ioVK5qBxdD9ExJed/nCbyBW5amSkO8tIx0ROnll8BPxoCXfnG01NcDa84DSJETKnIN46Mngfxr2GmUQdyCrGOqMf50H7H645qVMsngb+WrCsvjRZxE0dGC0rJh1LhQY4oFBWyKzWqhNiI0+6GcZwPiqhhgoj0SQ9w0XjRftB/Xbxpv4nTpHeENf2k+gZiWpmTcNXK1VUHOk0tfRwvrUw6sxpZ8NCVm1YQ7R3+S8QBAlSo4zwrimoxW86x2WxvId6P9QTpfqYtwDzG2IMtTY9MGjvp7XQzZ+kYAkMRAa/X+4CZM7uNKLvWy6ZDiPodp82m91LpkGBpGAJDEgFNC9A1gwwRSFuASe0Qk+dtGTLCkjMEhgoCUN8hw0pc/8+w0GkLMPI9vsiUIRMsOUNgiCFAc/+BFWBtqYFWX9nDEGAI9AkBbZFMiS8C9ilhD5EzGYFNgoU3pBfpgS/2iiFwxiLAi9qugiHlS1uAVVnhsXVkCBOMCENgSCGA0RfzYEMWgNMWYGy+cdiDN4SJIVV5rLAMAeit6QteKnyZ0OFM1lRi7BdDgCFwagjICeOVU4vfW6yMBFhkI3BvuLL3DIHeEYAlHBaBDVk/ykSAySaXqdC9VxMLYQicDIGEueXJIn1eWNoCjISG9CCfxyALZwicaQhoQjfQ20gkvarU7TTRIEd6vbrefOTIEefRo0dztm/fbhnk7A5q9g4fPuxgGKZXRbDBguaqGqK9pn+YQeM9Kww5OAiss6WlxZ3flH+WYlPGiRxvKSoq2tnZ2bkqNze3HUUxRJ1JrzqzK9X69evNBQUFFRabZUFeXt5ucL88u0owCLjFHLjbCcO0mUpbgLWFcOvgHoFphHC73eUWi+Wm2pG112HjqwrQxXCUi4xR8wKhwKt79uy5r66urjVtBIdQQmBlRYc3JycnZzEwnBy2hT97+umnz1+0aFFsCMGQeVGhQ2vnGDOnlP52FFRoTowfujaADeNJkIrnLnZfVFhYuAyN7js4trnP0+lZtPfg3osPHTp0TTgcXuZyur7sLnR/Z7G6OO21AOM5H5wUaeQFjgvy8/Ofj0mxA20dHcsEnh+ODpJtJva1yqBCpx5e7yuB4/EzaLgK193TwHGyA/uNhFcwC7cW5Rc9r6qqGSr0nRg1bqworXhl4piJO0eMGLHurbfe+lYoFPrE6XDeteCTBcMGluPBnTsw5EeOHDkrLz/vd7FY7IPPtn92l0UUm2VFkYcPH54V86hBhzCp0QY8aQtw3ItBBhq4Acz3RKK+vt4GtzC3uvPcv8Iou2bfvn1fLCsrex1xUwC7/vrr/YFA5xKrxVqMRji3J1rsXRyBXfW76ux22x/gkmfvli1b7pk1a1YInigmYBpydNZjs6IMp74hkLbQ9ZBN+rRURZHkSA8kB+4VRgrR4XB8CWrdf4Yiodc3bNhwx4QJExp742jv3vo1aJQhm8M6p7c4Q/39zp07XcOKK/4Trs7sLUdavgnhbce814x1hVHRWPSA6SXNRddQh6lP5Y/vvw6wLXRUlt7kFXNDnzg/jZHJSyZWmr8A4f01Rt5X9+xa9/V58+Z5Tpbles/6g5FIpEHkzRMp/cniDsUw0mYqKsp+4nA4z+voOHZPbW3tFsJhxoyJw+DXqQbOvD4dirhkXGZIMFxSGbKNZKqYVuHImKFBQADz3nHhSHhrMBRctWfP5uGnylKHp+Offr/vwCOPPOI81TRDJV5Ly+H50Wi0o93T/h8oc6LBwRvp5TKcGDY2Nl49VLAwspw+n+/fO7wdj2ZKk2T3jBh1sL2R68p1/dgsim5Ph+eHdXWTmk4VHMzlW7C95Bo7dqz9VNMMhXi7Du8qcrnyfyzLsZ0N+xv+C2VOrCGIFnFGTJKjHR0du4YCFkaXkXxywntrAs9M6A++Vag+loZUX7c771qb1fZFj8f7k4qKitV9I6G087zZXFqak/VY9K3cvcemVWePp/0Wq9U6CZrNTVOnTk3skxPe2H6bKcVi+z9q/Ohg71RYyEkRMGjoNIjMSVk9rYF33nnLyJyc3B9B1fugqWn97/uaWVSCV3UcrnY6S/qa9IyNv3fv3hqHI+e+QCDwGr7/M7mgF154YS6U6SmyIn+86KpFweQw9r0PCMRXsvqQoOeoWS3AZGmVn1/ybbPZXOjxe34+adJlgZ6L2ftbURAVMovBloghKk3vOWVHCI2whcWFd8FjhKvV2/oIFgJT3K6Ul5ePwgJWaSAYWJMdJRp8XEqSBCXamPaW1QKcV5Q3DSZ9t2CkeH5Y6bC16VQV1EWLDP9AWMFOJ/kZl+bGG28sd9gdt/gD/ldGjhi5tXsB8wryZpIvlkjI/0n3MPb71BDQbnmgibABT9bO+2Da58hz5H0PI2c7tjv+G1ikNYLC6MMNIaZRJmWkMQDbrCThdudeKopikdfjfaZ7AWh0ttvsF8Eaq7Gh4dDe7uHs9ykiQMOmQbaUWTsCF5cVn4fRd4Hf73li0qRJ9acI3QnRYFGUCztp/6effho+IXAIvrDbc+ZHI5GmdYfXnbDHC5xzLaJlZiQWWQ3V2j8E4TGqyNq9T0YQy0oBplMxBXnub8CKqr6p6cifMwECtyrmoDNsXbduHRNgDUilCKb2seq86rzuuI4fP76OF/jyUDj0P93D2O9TR4AuVqOdpFNP0XvMrBRgu90+xWqzXY6571MYFY72XryTh8ydO1cEmMVYUW196aWXmFE+4IIV29vo1DpLnCXl3dHDya2ZmKhEOnwdH3UPY79PHQHMgQ2Tu6ybA2vH2vJz74Hae/RI55EXTx22E2Pe8+N7nLjiolSJSetODB2ab/bs2fdkQVnBm++/+/7+ZASwTsB5vR6a/+7evnF7Y3IY+943BOhmBnr6lqrn2FknwHnFeXU2i+0ar8/76wk1E470XKxTe1vrrs0TOMElq2rDqaU482PRSSOU8gQLqzfffDP/4osvnoER+hWc5GInkDJoClh4xbhhzGGGbBNgriC34CtYblaOeY69kAGGWlJnfn4xOkJ7MBBsypTWmZ5+3Nl1EwSa/0ZDK870sp728ikmX9RkTB9omC5+2guNDHAWNd9hc3wlEg6/Pm7kuD2Z5ikoSjlpMlEpetpUwhUrVtja29sn0rZXpvwOZPqC3JJ5UKODRw4d2dATH6RiHzt2bOyOHTsKewpP9x3wE2FzPcnj8RhyIXa6fBiZDo4kVkYCkXeMoJlVAlxcXHwx9m2rIBDPovAYiDN74B6mGupMNBqMnjabXniyOBtnZ5c43c7hmXE7cKlXrFgsimbxEkmWt3/yySeHe+IEnWuxzW77dU6OfWZP4em+GzZsWB22C//g9/unpktjsKWDvf4GOJH40Ai+skaAyWwyN9d1ezgW3gTDDUMKDxPMUdiKat+2bVvaK9mfVwlYMV+AwanY2+r1fl5cOlWFzqmyuaO5mg7Sf178/gp3u79YahbNkyLRyPu9ObCDh8pzcKBkegyzGyP5gk+zy1FPw+F3odlIumcKrawRYFuubQxGsoti4dhSGBEYsWdLN8SNU1X5wGeffeY7XRUak2NyIOT7xbnnnturrSY6pxyMMJMKSwpvwT7rD11m14MFxQXX03736eKrL3SLSosmwzorF2en3+8tndlmFuGmd8n6D9dv6i0OWXJ1C+NIRe72LuUnOlip09/5WFVV3Y6UAPYjjkC2HOhv62h7AFsY7fv2fVZnRN29/vrrjmAwuB/zq+dPlR6c442qP1w/tnt8mp81Nzefs3fv5pQjTQcOHHDv2Ltj2rJly4TuafTflLatre0O8PIB5kbbO32+5TCU2IfVXs/mzZtr9HhJn9zJ6CXFM+xrW3vbI3CU0La9fntZT0TXHlxr379//8STOUUgzaKxufGc5PSHjx0eh+OKs5PfJX+H4wA7TkOdRVuHye+Tv6NOylpbW8fo7ygu5QUbgamYk5+zv2V/qR7W0yfF93q9oxB/SlNnkzZ/P+o9OqqtranXKU8PHVFPpE/7O5Ldk/Z+p52DnjPgAJAwf/58M9zdaA0fTtjdsMG9HT383/fvP3QUvXZ+clKXy6WiwSeMwyHoKt4pzaZmU2G0UN21a5daWlqqtthbsPdWbfJt3apiHjIK87phEOBPSCAwCiMs9QEfRDNBF6rc4kJbYSU8Wl66YMGCyJYDW9w1BSPmiaL1WovFXI1TJv+C+Jo6Tg0jz533fTfnnr3XvvcyvD/h6B08WlQQTczxzsdxyGc7Ah3/2LRvU+P0munz4ML1q3if0Awwx3SXDS+bACd800L+EJ3P/Qv+TvvzzjvvOJHn1dFI9L3x1eN71CKqheor8gpyf3bJlZd8wfQ90wknwlBfOcD6t07OqQDTLxOu1IG6rK7fS+ZYB36v7cI6UR5gDFsd261ud/4iCOQCBJywZQiM4QLN9vNoVMpB+A3oMGvcRe4bBJMwR1IkOCJ1lQshYe2zzz579x133HGC1gbNp6CqavitgmC5HouZTlOH6VF0pntddtej6Fj/P2j+MsEQvqCTqkJbnIx1k9E333zz0lGjRp22tZPkfE/2fcAFGBXH33777VVOp7MKjbkEm9wFIi/mqILqgtcCs3bUT1YLzKKlMipGK2fOnPkTFCihipFZGh3PwhtJO+VBIRA5OqBQx9eRyZoKx3ZxKysYwGjBU6cq0MxGwITSgjnq9Msvv/w+/Jmgrpngjla7tE1AxG986xtHn3z8yb+CR2RAj9IKW+Hr4L2DDrorWARbiIq/EH/tsVj0GQihtn9KK7FYpPgyGuAt6Fh2I+4Jjs+bmppGI/09KPPNaCwPYaR5omsP1oSGuOpI+5G9Y8aMacP7EZgHnmO2mmcBiwnYP3RFhTA1rn55sAg3Fgf7q6AdPIZy9rhwaHPYLuZ5obD+UH2iw9GZ29G0o3BE/rDbrVb7RbJf/qMuqGPPHjuJsA8ElHcRt6vWTCYSSixcTXC6nPOsZuutuETeitHxBLtrTC+Ky8tLbgbda4Lhjj/gypwJLlfOv8D53lloDx8Aq82wsPsSpl1Xjxg34nvII0WA4Rt8TH5+7ldF0fI1dPgfgIN1HKeIaIcPYLpwbswUW6KXAfVRizq4gBO4OaqsVuF9yB/z91sd6Hz09DmgArxs+zLLJeWXXGe1Wy/D8cgyRVUdvEp1iRpV6AZxDgZXCgdBmCxLSofAQ6R5/iwIJ+41UgVyS4KjvDHRLEBMORJai7Y2TWMp/iCgJNN6q9N2zskjPvbQVTNvqUP8qCAKo/FZi8gCKo7Wtjntf3wKJm79lVeWL128mDgymTqD/r+5XHl3YTX8++g4KJcSNJblaGCvffvb316/cOFCAercdDTM60HvEsQpxe0Pf09e+KGRZc6cObNQtrsEkZ+LVXW7L+jbpQsv5VNVVdXR0NCQj3nxjYh3Ef6I1zD+tiqcsiEUiqyjeP3xwEngBVQPUEd7Pf8LnEdH5VjjltVbOpJ5whHNiRCIryL9dSinE+sB2ggOIc0rLShdRPhj5Xr8d77znW/ef//9zcDLjnc16NQmAtcC/K6MhmPrsOaRMqpjugJhdd5mNltvRnvIi0ViQfD5APIZBmF8HML5xrhx49og1Hm5+XBGL+bTCK3lTfjPumDWhRgkbrdabAsQv6W1s/Wnkc7OSFl51UMQ+kvRkQeDXs/HtKhYWlE6DyP6tUg/CrzRiPtGVIluDXYEB3z0JazRVgfumZo7tZJ6PHj698mSTPtipBq2x5RYCIIcAWByOBxwFxWVPhOI+F/B0LhEMkVwGlU2c5yZl3ACEIIeg+ApEifxvMybydk8AFdRmTxKJ3DwtwGa9IevCFMFBZ+8hbf8OxpJAKrWr6CnQ/oFJIN4ICKEXOUkjpMkpeGNN5q10XvzZqiSgrWIehTobXSzwy4I7i/QSJZDV+OeeuqpmRipzhUE7iKkpkWpv4uCUAv1s5xGC8yzVAhmNYT7QjTmK5GNFAlHHhd48a6y4rI70Ch34rD8dtCrycnLmcMp3DxkVYlytEFleyMUC63bs2PPVnLrirT98lCHBGG6NBaL7A0E9u7rLVP0ZKJFMLtuu+22yuuuu86LFemKwkL3ORjdrgLv5cFwcBno3GsWxOFbt24thWP9O/D7PLx/DFZ156L+bkRddKLuwuiUw3BYvC8qR//ES/xP4UC+BFrI8OZgs39U8ahytJcZvMhfgZGwHHUQxG8THM5fh3zaIXgPPfbYY+/qGhPoBc1QqaD2jl61ZUt7bVlhdZ7DdTHHCZfFojGnyWKi63WezzHnqCVVJd+Hk4LaTm9nBzroo9GoyVJbW/GvqMt5KPdR0H4ezuhWLVmyZI9Ovzc8+vP9gAowQLTDuqc6EpE+2rNn72+nPzy9o7ufYaiaX0BPLGD+u7R6RHWvo0BfQCO/xjd89YYH0Wg2FuYXvvx5acnBW4Wr4htoaHPhC3m12WSuhhBaoZ5Nr66uHgf+imnkwGcebivYIUvSE1iAWnveeTPPdeW4ZmNleTGcy5MBLMUpQmPbjPn9n9esWbPh/PPP9zoc9n/FnP3HmI+/g4Z9ATqqGmgJTVAf/tLW2fbxq8te3XPvvfdGPo9Po8MfeOCBIiojFrCWTp9+1QlzeD0/WVZWA5v7SirKFhdECzwQmgrgMQLlPACMH9m0cdMH6HguhXvai3FHFQZs0wWBcOBPWzdtfRwnnMajU6vDIG9Bp9UOVb0RWszeiRMndmBqMQsCuggq9YOlUqlPMPPDOJUvB+36QCzwiBJT7sdawUgcvmhDh/kzCN5KnSf6lCJSIz6CZeVl38QITeecKzleLYA2t6a1/cgWu73mHIvFVoPe/d/RcZS1t7b/F9YtfgGeY5WVlSS8Y5HXm6D98pNPPrlNV/+T8xjo7wMqwIGOQGOwOLQU1y3SSmGsu/ASOKigL0LNaT7WcswwDxCYExdjuK31hXx/PZUKsEt2Olo3Db3wunDY/2osZqOR9BoI5iRUMKbZih+Ncjc0h4/RCFbX1NQ0EF00xEeh5n0N9tZjECeMOE1o1H/FaPs+LlRrojjvvvvuC5jXz0VD/TKE91yUdSdeP+f3t60pKRlBo16P805Ke7ofaAKTcbSwEJrC2yfLyxfx/cUWteVjOlIrY88bmkOLrKh/Cvh8K7BYqG3/YLX4aaizt2EOX4vO6/nWI63PQDUmv91ru/5OyCIkh541S+YcpKkDdnCcoh6OxiJ/jkZ9y4HNXixuXQoH/j6Pz/NoRUnFqu4EgkJwIzqEx6EZnY2Oswra1kFobH/BiP4e6lKNlcSWwpnScMypjmIX4JeBQHtDbU1tITSwYoS3oi4ehfb01vTp073daQ+a3wO9jUSLCWjo82jVtjsotNqMCtiL/cdnEEZzTkMerCZeALoxGITMPRWCOOyf39zaeiGtBFN8WrUmvptbm+dibngxGucUUpN7oMVhpXkkwufQlgZWusuT4xA9aBZ3ofGswALYCjQaH+L9N+IYVtbk/Pr6HQLyH+DtCLSJlO2xnuhgRbcMvM+gP1xnU0nqd3I8mk8i7GLMi2fRQlVy2Mm+YwdhGOGHv9m0CoxRkKZD2nMIuKMepui/e/rcuGdjMfFEcUGrKDlOw+GGcQi7BO2gGu+5lmMt99DoGwwGXkObnJucV3K6wfJdk92BFuCTgdHU1DAPvXX0cMtBWkQw7Dly9Mi9EGDP8k3LhxlGtI+E0BhLfT7vz0KR4IeYyz1MDQZzwo2+gG9t98bfR9KGREcnZekMdH6IDua1wd6QjSgwOojL0dawQBiqx65BVphtkuwmejMjQDCahsORewVUzo7DB1s+MpI2tidmRKTIvrbdbbRo1u/P2rVr7Tgc/03RbLlWlU1LYbDwKyyIHcCc1wr3mNo+cr8z1S3DCVMnVMJ9zoRwNEyLQrS2d8Y+NLpjS+8BzPen4mDLOqj9G7OmsIN1BIb6bMPiwUZvp/f1hctS1bFMwH3++eedUAt34LqQJzOhk0la7Cuej56+BaPb97CtkYsV6nMgwL/HSLwNKiYZfQz4Az5ujWDyi+2sk6qoA85ohgxgtB2LuvgHFsw6MFioR1qP3J8hyX5LPqhHYKw80n7gGLShd1663jh3N9OmTavCgkY1RuCP+w3pbhlZbJaJKFsxFknk2bNnL8L3H2ExrBYN6WGMxu91i97vP8ELh62yy7FvW4/OZXe/M9BPGW6G6SsWSf8N2TnRma6g+W8g5DVkp6OfiqDtj/ZXXn3KJ8edcz4WYPkWf8sHfUr4OZHhNnUKjgCbPa2erZ8T9bQFYzV0B/5WYXX0ImxHnYeGs1+Swj/ftGnTX7HieYLV1mljpBfCy9ctL0CnMhv3x66Gz7EUI4pekmTda1o0rSqqugv3aV2A/d1f4m4tD+qhobmxlXYBsuYZ0G2k3lCiRROXzXkx9hcbGrY37O0tXjrvYQo5E3u1R7H6uD+d9EakOVh/8OMcW85iThSLY1Clwcs2shwygrYRNMZUjDkLAlyBVeiVRtAbjDRgNDMXWsbdWLh6Bqvsa6AJPQYN6D18nmAOOhj513kalAI8fv54K7S4s7G1suqqq3o3INALcaqfv/3tb60wzDkXdDcvX77ce6rpjI7XZTa5wmi6RtGDbfNczAdDHcEz0/sk7QDAsOMH2LbbgdX/p2GXPRYbd9X+kP8tozDsLzqDUoADkYAK5+HLsElvaCPHxVwVMG0ci1sHfnmmr6ym24AWw/sGzBvnopPb3ov3SR6WbAJWas05w3MsFY4KEUYtFgi8FXN6bVcDozetWoexEBb9LPhZ4I55J54ESpe/TNORdpdfkH8rLN1Gw5Dn5tra2hY4SLxHVRXYg/j6zcY803Lo6QelAFOFY47ym4cffviEUyg64+l8FhQUTIYdnzMSCZD1D3t6QGC+e36p2WKe5PP7/j5jxoxhTU37cx2OfPIO4sZ83YVRyw3pdJpxOAGmoQ6YQNqwHWbFCGZFHA5maRxWVujCuDDsocPj+fFHF/oXNmLlf9vvfve7rRCgrpNdPWTeD69wrHCs0+78OgaIpSvfXbmGtvRg+nmFFJPWwDf4oNjC6wsMg1KAqQCnw3zNlmObg+NpR+vrD27vC0hnalx0knklFSV1TquThDMPq/O5GHlH44CF22axjrcX2RfHJMmFU1NW2ApbYWIoipxAR79wVoyPqZwSVWA7qchKDEftMPzy8fsGVEWEq94iHBrIgSDbINLm3Ly8g9+6777ngOWrA6X9YGtSxH7vN8CrEvaGfw/3uDJs7ceg7BOCQf8TA8VXJu1r0ApwJoXqKS0dI8MJpLk4QLHhvffeGzQLRj3x2l/vsFU3H9sot8J22YmDXwLsN2Wow7VQJzEScUdoPMW7ZoynHtkU85gU3ocDAV45FgsFlWAAh8EC2HKSw4onpoQVCYfC4CHQZIJAIJpIZ61z8FmIjmEkJ6o3WATh36ZMmULnfwdkoaiurvosu8N+fdAf/E1JSYm2OIqFrCtgpx5qbW17v79wNzKfISPAB+WDAhrbTjjFeyMbe1ojK12nBcGSIaSN+O3BlvQx+EY4ZpLkGsxlI1iBfhsqsrdD6ggIOBXwxBNPRHGULq0tLuo8sf9+CNtmF9qqbTQ/7veH7NddeQVfQxvwo2wvgAEVq89OnEe+Bs76Vr344otN/c6UERkOVkssI8qWTIMqsL6pfjIdTEh+P5S/UwMmY3+oljm6/fXOnatdH330Ua7RuJDjvoaGnTWgi0G9/x8csBgdjoQPwzDlZ3rucJ9zHqYMAaxE36C/y6ZPTXaHigBnU8UwXo1HAGetH4WwNuqO+aCF8f6g/0VcZL79rY/eMrzDMr4EJ1JkAnwiJuzNGYjAamgVWAXfDYur35PgUhHJBhor0Z729mNkSpmVDwmwVpis5J4xzRA4RQTKzeVjoLjX4LDI6/r6R06O41ZVVgItLa1LT5HMoIzGBHhQVgtjykgEcN3LVBhuhGGyuoXoNhxpqLFabbcFg6Hn4KProJF59TetM34Vmly8YrXVhj8OC1ht2PsLJYP88ccfF2IrQZQtsphnyZNx908r7Q8mx8E1JxUwYBBXr17dnORhkluxfkUhjAJEMSLyU6dOJa+HKemIBtHH4959bPfRBecu6EymS0cm4UonX3JKUY/FExipjCzCwkpId1xHh+orx1W6iXdLzCJADUyEJdNJ/k5ePrCNYz1gOdCxoG6B5keLfIDhZgj3Qw891EYXmdNCHh4bytquXxWKRSYL7IKLkFaCJZWA8iovv/xyqz5i0YJXiOdzLOaY4BJcPHjpSD7oQHvK2DaywyLLDMxbdLo6b+SRA3NQBw4M+JLTUTitUo8aNXyYJIkhuMhq1tPQJy0+wr1uIfGE46UqjEuOJIfr3yGI5INLfGXXK4cWX7845eo/i80+FhdktMF9kUa7KKfoXtjDRw+1Hfpj97rW6WXL5xk/AuOQ9mTYvf4QWyPj5sydcy/8IaW4hyktLbqwqKzou9GIMgpWRV9CY6lMrjy4bLlaUqXzHC7HgtnzZh/31ABPVcMLhl9UVVJ1D7wwTj7UfOjrZNWTnBamhJeWl5feAA+LZ02rmXJf4+HG6cnhrVKrtaqm6vsFQsEk52EnHW271+w0V+hxIA9iZXHlXYWOwitEmzi6uLT4BhJGPbynT2eucxa8MH7PtEezjNKinH322SKc6t3z1JKntLOuoDsKncLdxcXwy9j1CFbhfNElzoNTt/9jEkyXwOHAjVdffXWZHu7zteRVFxf/SFTEycBjJjxxppxbRkc0CiaKP4GgzTzv/PO/093FUFgOV4Ovn2IUTHFrA3xHwIHdbZzZXpeXl3MtDtcv1POkTyw+8cXFhTfZc+w34IoXcq1zmz6P7YpHbouuRr8zrbg4/6qvTPnSrOT02ndFISMVbfuqzdP2FexNfzXgDzz88gsv158QN8tenPECDMFt5USORqVPBd5ciYZKWxlJjxCClVGhzSRu8QQ6Nze1Nx0foRebeJvNcqNFsHSqkvoPT+uR4xd3wRGt3WInQwa3X/Wvh/3wnGE1wxK09+3bXimKwt1+f/B9pF8bicQ2u5yu+5OFvFgsDsBNbekxn8deVlY83RvwvhPxRQ7ozG24ckMYjc3GC+aOQwcObYe7ne2jR49G19H7I3JiGIYZ+RDShBfJf/7znxhcQ+S69xq4rb0Ih9cPRqVwtLXVlCirGlOPqUH1fXhpLIK66Qn4AmsgjAmNYt26bR2SKpd527w7/V7/tlaPJ8EncYPRzwshKZWt8mq4gq21WPhJyVxG/BEPBL941c5VCSMa2rqC4H8T8dph07UBN1y8Y7Fart1zYM94Pe2iuxdh0FbodsTYwYaDH8FM8xqM0mS2qT0QZg7z2YVmcw6crUfe8HT6Nf/Penj8kz8AuhVfu/POJS6H66fY5n4RGsSLunaRGrdffnH6tl2muZ3xAoxG5YePaTsEd04sGnF7jnlSKtjh4HwwWKjGiHIl1OExDpPjuJAuNimSqqyC1c7XMMrOz8/nU9KicwigsefaZFs1DJJwAkNNODbPyyutg8tcB24+3IErOI7i9NMHqKxqqK7D9UqDV0YJHQCPozE/4jiRh89qOtaWsFJazC1W4NEyajELk3Hc8BYzZw4gTUKodDrJn/B5HcUIGiXa+ntqqFFV8qGDWGp12G+HelwMqfAnq48Q7D1QbZsEqCE4iyBBZd68NrI24YP6u9/9blSAe9+S8pLZpeWlC9sDLY06ffpERxOCSWWpw2S9xh/slAOByJ7kcAh4lOyjV760Mqy//8EPfpAD/Oa0y+0bofkcw/U3+xHHl+vMPa6poKPExWkh4DBp7Ni6hdFwlLxPJlRkrWyy9H5ZWcmtpfmll5cV2FJUcMrLG/K+BMcQr8F2g3xUP+f1+h4m5/k6H/39CY1h2m8ef+xOI/I94wUY1j8meJaAM31lM9zA7q4YUbEgGbhwmOPRuDydoc6N2Ojfh039xAgH4RLajra9AkFdghH8nJKSs25OTiuJkD9FtUAYTJ2d/t/Au2HCxxZWPJGcs+pCgvlfFCaJJtBKCBbRgrwo8DW9saiocD74SFEvKRzveNwWcACmixuPRY95MCc8aZ3BtSsulUkUgUhoj6iK5k5f5wrcNrEK6uhDHR1etx5GnxB4XbDAt0WhOeyi6YuOW16RYquaYriXaScslza3tLXEqIDJNGRZCsqcqcgsWO3ocFItm+CAHfbTppX4pz9t5jYJ92/wMX/8FBPe0zU5khyNpmAEF8C4gkP2YISeGZEje3RMiQ544Pft3vcabqt4Et9xJcuwW3X6+mf9rvo9wP2HqKvv+jv9T+Pam1Te9Ij99IlBpRoa22wjsjtpYzAig4GmEVEiubhGg/xr+aAqSziNRCdrEg/AdGEElqRQR0uOzWY666yz5umBr732mgNq5BVY7NnW6ffvgheNxPyU4mDEzFMhlDgIvgu+trYlj3phMbwNUfzobS+D2lxw6aUXfQEdyaeY8x3W6dN8lufF3CMtzSvgjmkNHJM/iE4gMe+kBRyojHk0enUe7dxRWVg5Y9Kk0YlwnU7ypxJRICmmHDRmQX9PdHDXVAlUaHr/cklRUbhyeOUJdCiNystORY6lzOWJzhNzn7CTthE1RwNyVN42d9rcy2BamVgERVrAZ6MzeUudLgfX1Nx0dTIPuU7Bjg40b/HcxTadrw9f+TCE/mx5VWnVl+iiMZzTHYMuyxQOxxJubTDC8nAI7YYXlTasJfy/ovzCm8htrU5j5cqVFlxodjnm3LtDocBneJ9SRxSP6gWazz44z98G4U2o8DqN/v5EexNxc4/DiHzPeAEOBUMuVPwWnESajFFxuxSVkvf9OH/YL2OFcoPFUThe5YXhGGkTB/0xcYzgeo5o9cjqcyKh0IFwMPyXBOh0xRIGR1mRtvoUn737fOrPT/35mCyHfw6hLXC7XbNiMUXydnh/Tbca6jRGzxjtxKj/oSs3v23XoQ1vI25TRA6M1MPR2Czgdx9GVEwCxTGYy4s+X6tfD+/pE9fN0NUkm174xwtOPRzqv000ia3ojSz43q7IpkdRrpV6uP750v+8lBMJx3bgjrdo9zkaDiHkQSA/tnP2atkUGYNORbob81M9LZzyWaOS8iE6TB/uM/odOspSCFeiswy2B+0SPD7OmT+HnORrD2GGuehTgLlRsAiz4Ri/FusQz2BFOzFCLlw4XkT4IWDfhJsWVoai4fegTo0jwSYiOKIYQyccghCfHwyG20OB0J/i1Afv/5jCcLgw/UQ1KQ2WEz1oGmmzIglc12zBFRz1GILCHVAup1RUJAQUBVCjwejH0dzoppAvFMO1kmStk9jqITVy/a71b1ujVtxAKcjPPfdcYk4IwwA1sD3wYYmz5NPh7uEnzKeocWKxZeOUOVMaJD+uWMuNRCdWTUyJt3vd7kDNZTXPul3uQF3dDB9G6z9Eg0piYQlH3aJYPf4bOgg1Zo/JOPGz44031iTmyD1WgGT6NBaWdw2zD0ssYsH+NyxZpb9ZrTnau30j9n1aub9yd/f0tKimSP4XVckUpe2m5HAIURsuEfsDFuSiEBgOnzJGxUQjRAezT4nF/ug95PWWTSzbiNXmg7tduxP+tHCzTINZtC3BqnrKCEjqLLx0vg16Fqi5Mpz6eZJV5Jde+ky6+eapb8gORamtGBHCqvTf0HGKeodJfOL7cmwFWjrlTmXXx7tS6CeXYdB8xzVcuA8sZfqRNm/MFjpt6FhChkBaCDQeOnSjx9v2YlqJkxIxU8okMNhXhkC/IYA5ipK6/pd21mnPgXHPzCSyMko7Z5aQITBEEcAltth8MEaC0xZgWOrcXVSUP26I1gErNkMgbQTMvBmbX7SpmPmTtgCLPD9M5VW6+Zw9DAGGQB8QwA4A3IrhViwDnrQFGJfeYwXyjF/ENgBiRoIhkIoAtipTX2TwK20Bhh7Pm7CflUHeLClDYEgiAEMYXlVglmbAkzYRjL+cSTSuJzGgLIwEQyArEKAR2BjxhR6cdonBAXR5NgKnDSBLOFQRkAUZ008uYQSTCQ7pCzB0ADYDzgR6lnbIIhBfvjJk8EtbgLGNZQgDQ7YSWcGHLAI4XWVY2dMWYJxMUcCGIWqAYaVhhBgCWYAADjMQl4bITtoCjOtxcNhdNYSJLMCcscgQMAwBLGLROXJD6KUtwGRGIhmyFW1IORgRhkD2IADVdcBXoeHiRMVdu8Z0I9kDPeOUIZAxAvE5sDFrSGmPwLAEE2hDOuPSMAIMgSGGAB3oN0pw0qcDFjiR7QMPsbbHimsAAiTAskHnCdMXYKyisVVoA2qTkRhyCNBxQqPsodMXYHhzk7CaNuTQZwVmCGSIgHacUMGBQgOetIlohxnhTpU9DAGGQN8Q0LaReGO2YNMWYF47Ttg3xllshgBDAF7p4SJclckeOvMnbQGGs3Fc5WXMUnjmxWAUGALZgwCNwBwvDKxHDjjpltl5/uxpNIzTQYUAzhEYMgBncJxwUOHBmGEIZA8C8H8NzdeYs0Bpq9DwvJ922uyBmnHKEDAeAajQJDyGyE8mRHAJtEHdiPEYMYoMgUGLACa/nJx0d1UmjKYtwLiDlpNiYUMm4pkUgKVlCGQbAgouYKSbGo140naqgeNQalnJ8B+2dbTdgHth6YQyD7UaU3PyWA2Pdzx5rcRCtQJe4T6EEzhFleGI1kSeAOK/8T+HS7ISkwGexyFFSqSQv5F4PJxY5HgRF9QRWbxHKIXppdfygjISXxGIhxMF4gPX8yJTXNCJLS/48UQ+8fCu1QOVfJoQL4qWPpGntryg8URhiIBwuOGOe/JN5E1l0LJB3rhtDuQ1sohI+2tx/pC/jFyoSByVnfiKP+TUW8tCwwXv0B8inNPUKqQgh2MafT0BlUcrO73Q+NKKFi+KVogu/ikc+cJQj1im3FXCn/jGF06msiAIgMRvLyRaVGJJlgWzxRwFn7DOOZ6Xnh/VJ9WVHqYVAJSBDl3xSQyrlC+A0OqP2ERcKjO9Jxzo0evARHVNWiTR1L9rbQUtG1ssSM2j4slzIrUjjapWFuIHDwgdx4d4Qtx4CLBDAh0rRQANcKdFIPrab3KrHm+LGjbxhFo6oqu1Xb2sVM4uevF8gR/lr/2paFSgj9oD4KouSxRG/FBZKevEb6pXYCEh7hjwso8IZvromfaZTnNr8/912Rwj6IZcXJrHkZMB3KIXL5hAd/oBRNhKiwiQBFSihK0v7DsJooV8aZlMuPePLuiMOyeATTU5yEMcekRIBMI48h0U9fusNltOGK+0SsGt93CGKXMQT7Q6ZCngMlzYk1A4bsjWnO1SgyVrNWTD8RbcICihVYoCpTfhqsqulnv8N7FDfNApEbAKGhwSIy7+SfEyUVKTFWhh6b0rLB7OI5yS49HoAgx0G3HauJFewaVqCvjlAZGWP9HVMtM+NZzQzDXcTLiFPt6gZBQMbbur8k3oIHnkCoxFukCXLgGFGRzhqTVUjRLxBje/HJDkZMIWBQFZ6lyQLp4rrt6Nm7+SUzXAhdQQHlU+1trh8Af9OSOGjWiBmR9C4+dliGIcGgHZRkwoG7jAFeBIjQD0BjJaMtihDkPDTTZp9SzCTJ54IYFBAGho9QouuuobdAlkwkTzbBpvB7jgTPW2e+12lz1qAU2tLHRmlYqDxLT9QnWv8ZXUcolbDu8pXDctot/URqju6aEdE40nZExogHfUI+FAGAJXtB0qDFqriqarlQ8XtmmflF8cc2IaAk10I6CLPg00qGMTcIE8zuehrAin+iLaej1Rhrj4DezxdHWzNtqFw8F6opvpkwRD30idPfbsT3F95Oa+pUoj9lykWZl8oWAfaGhp+xB/CEfF3blcY30jdcAD+8xF9isHloWU3Ofi18qUN6f2Yy6irew96vvvv0+aWcZP2gJMYxxyN4SJjEvBCDAEhigCSfOyIYoAKzZDIIsRYAKcxZXHWGcIMAFmbYAhkMUIMAHO4spjrDMEmACzNsAQyGIEmABnceUx1hkCTIBZG2AIZDECTICzuPIY6wwBJsCsDTAEshgBJsBZXHmMdYYAE2DWBhgCWYwAE+AsrjzGOkNAtMgWy/DzhqtK9Pi53GyEpRxMN2cj44OcZ4br4KwgHJNVxZBo+V8XwLVImyGwFQAAAABJRU5ErkJggg==';

const COLORS = {
  bg: '#F2EBE3',
  white: '#FFFFFF',
  primary: '#2F402C',
  tan: '#C6B9AA',
  muted: '#6B7280',
  border: '#E5E7EB',
  text: '#1C1C1C',
};

// Curated luxury interior photos, one is picked randomly per send
const INTERIOR_IMAGES = [
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=340&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=340&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=340&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=340&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&h=340&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=340&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=340&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=340&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&h=340&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&h=340&fit=crop&auto=format&q=80',
];

export function randomImage() {
  return INTERIOR_IMAGES[Math.floor(Math.random() * INTERIOR_IMAGES.length)];
}

export function btn(label, url) {
  return `<div style="text-align:center;margin-top:32px;">
    <a href="${url}" style="display:inline-block;background:${COLORS.primary};color:#fff;padding:16px 40px;border-radius:99px;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">${label}</a>
  </div>`;
}

function detailRow(label, value) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${COLORS.border};">
      <span style="display:block;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${COLORS.tan};font-weight:700;margin-bottom:4px;">${label}</span>
      <span style="font-size:15px;color:${COLORS.primary};font-weight:500;">${value}</span>
    </td>
  </tr>`;
}

export function wrap({ image, heading, body, content = '', note = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${heading}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};padding:48px 20px 64px;">
    <tr>
      <td align="center">

        <!-- Logo -->
        <div style="margin-bottom:32px;text-align:center;">
          <img src="${LOGO_URI}" alt="${STUDIO_NAME}" width="160" style="height:auto;display:block;margin:0 auto;filter:brightness(0.2) sepia(1) saturate(1.5) hue-rotate(85deg);" />
        </div>

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${COLORS.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(47,64,44,0.08);">

          <!-- Hero image -->
          <tr>
            <td style="padding:20px 20px 0;">
              <img src="${image}" alt="Axis Living Interior" width="520" style="width:100%;height:300px;object-fit:cover;border-radius:10px;display:block;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 52px 52px;text-align:center;">
              <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:normal;color:${COLORS.text};line-height:1.35;">${heading}</h1>
              <p style="margin:0;font-size:15px;line-height:1.75;color:${COLORS.muted};">${body}</p>
              ${content}
            </td>
          </tr>

          ${note ? `
          <!-- Note -->
          <tr>
            <td style="padding:0 52px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;color:${COLORS.tan};line-height:1.6;">${note}</p>
            </td>
          </tr>` : ''}

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid ${COLORS.border};padding:24px 52px;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;color:#9CA3AF;letter-spacing:1px;">© ${new Date().getFullYear()} ${STUDIO_NAME} · Lusaka, Zambia</p>
              <p style="margin:0;font-size:11px;"><a href="mailto:${CONTACT_EMAIL}" style="color:${COLORS.tan};text-decoration:none;">${CONTACT_EMAIL}</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const emailTemplates = {

  lookbookDelivery: (name) => ({
    subject: 'Your Behind the Design Lookbook ✦',
    html: wrap({
      image: randomImage(),
      heading: 'Your lookbook is here.',
      body: `Thank you for downloading Behind the Design, ${name}. Inside: material palettes from recent projects, spatial planning principles we return to again and again, and thoughts on what makes a room feel genuinely finished.`,
      content: `
        ${btn('Download Your Lookbook', `${SITE_URL}/axis-living-lookbook.pdf`)}
        <p style="margin:32px 0 0;font-style:italic;font-family:Georgia,serif;font-size:16px;color:${COLORS.primary};">${YOUR_NAME}</p>
      `,
      note: 'Next week: the mistakes we made on one of our most ambitious projects, and what we learned from them.',
    }),
  }),

  bookingConfirmation: (name, date, time, meetingLink, cancellationUrl = null) => ({
    subject: `You're booked. See you ${date} ✦`,
    html: wrap({
      image: randomImage(),
      heading: 'Your consultation is confirmed.',
      body: `Looking forward to hearing about your space, ${name}. Before our call, two things to help you come prepared.`,
      content: `
        <!-- Appointment details -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;background:${COLORS.bg};border-radius:10px;padding:28px;text-align:left;">
          <tbody>
            ${detailRow('Date', date)}
            ${detailRow('Time', `${time} (CAT)`)}
            ${detailRow('Format', 'Video call')}
          </tbody>
        </table>

        ${btn('Join Meeting', meetingLink)}

        <!-- Pre-call resources -->
        <div style="margin-top:44px;padding-top:36px;border-top:1px solid ${COLORS.border};">
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:3px;color:${COLORS.tan};font-weight:700;margin:0 0 28px;">Before our call</p>

          <div style="margin-bottom:28px;">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${COLORS.primary};margin:0 0 8px;">01 / The Moodbook</p>
            <p style="font-size:14px;color:${COLORS.muted};line-height:1.7;margin:0 0 14px;">Style references and reflection prompts to help you arrive with a clear design direction. The more prepared you are, the more we get done.</p>
            <a href="${SITE_URL}/axis-living-moodbook.pdf" style="font-size:12px;font-weight:700;color:${COLORS.primary};text-decoration:underline;letter-spacing:1px;">Download the Moodbook</a>
          </div>

          <div>
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${COLORS.primary};margin:0 0 8px;">02 / Behind the Design</p>
            <p style="font-size:14px;color:${COLORS.muted};line-height:1.7;margin:0 0 14px;">Our lookbook: material palettes, past projects, and how we think about space.</p>
            <a href="${SITE_URL}/axis-living-lookbook.pdf" style="font-size:12px;font-weight:700;color:${COLORS.primary};text-decoration:underline;letter-spacing:1px;">Download the Lookbook</a>
          </div>
        </div>

        <p style="margin:36px 0 0;font-style:italic;font-family:Georgia,serif;font-size:16px;color:${COLORS.primary};">${YOUR_NAME}</p>
      `,
      note: cancellationUrl
        ? `Need to cancel? <a href="${cancellationUrl}" style="color:${COLORS.tan};">Cancel your booking</a> at least 24 hours before your appointment. To reschedule, reply to this email.`
        : 'Need to reschedule? Reply to this email at least 24 hours in advance.',
    }),
  }),

  bookingCancelled: (name, date, time) => ({
    subject: 'Your booking has been cancelled ✦',
    html: wrap({
      image: randomImage(),
      heading: 'Booking cancelled.',
      body: `We've received your cancellation, ${name}. Your consultation slot on ${date} at ${time} (CAT) has been released.`,
      content: `
        ${btn('Book a New Time', `${SITE_URL}/booking`)}
        <p style="margin:32px 0 0;font-style:italic;font-family:Georgia,serif;font-size:16px;color:${COLORS.primary};">${YOUR_NAME}</p>
      `,
      note: `If this was a mistake, you're welcome to book again at ${SITE_URL}/booking.`,
    }),
  }),

  portalWelcome: (name, email, password, portalUrl) => ({
    subject: 'Your client portal is ready ✦',
    html: wrap({
      image: randomImage(),
      heading: `Welcome to your portal, ${name}.`,
      body: 'Your dedicated project space is live. Track progress, view documents, browse your moodboard, and message us directly.',
      content: `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;background:${COLORS.bg};border-radius:10px;padding:28px;text-align:left;">
          <tbody>
            ${detailRow('Portal URL', portalUrl)}
            ${detailRow('Email', email)}
            ${detailRow('Password', password)}
          </tbody>
        </table>
        ${btn('Go to My Portal', portalUrl)}
        <p style="margin:32px 0 0;font-style:italic;font-family:Georgia,serif;font-size:16px;color:${COLORS.primary};">${YOUR_NAME}</p>
      `,
      note: 'Keep this email safe. It contains your login details.',
    }),
  }),

  newPortalMessage: (clientName, messagePreview, portalUrl) => ({
    subject: 'New message from your designer ✦',
    html: wrap({
      image: randomImage(),
      heading: 'You have a new message.',
      body: `<em style="font-family:Georgia,serif;color:${COLORS.text};">"${messagePreview}"</em>`,
      content: `
        ${btn('View Full Message', portalUrl)}
        <p style="margin:32px 0 0;font-style:italic;font-family:Georgia,serif;font-size:16px;color:${COLORS.primary};">${YOUR_NAME}, ${STUDIO_NAME}</p>
      `,
    }),
  }),

};
