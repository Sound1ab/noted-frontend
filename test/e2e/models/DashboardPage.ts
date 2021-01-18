import nock from 'nock'
import { Page } from 'playwright'

import { wait } from '../../../src/test-utils'
import { interceptTraffic } from '../utils/interceptTraffic'

interface IOptions {
  debugRequests?: boolean
  mockRequests?: boolean
  surfaceConsoleLogs?: boolean
  interceptTraffic?: boolean
}

export class DashboardPage {
  private page: Page

  constructor(
    page: Page,
    { debugRequests, surfaceConsoleLogs, mockRequests }: IOptions
  ) {
    this.page = page

    debugRequests && this.debugRequests(page)

    surfaceConsoleLogs && this.surfaceConsoleLogs(page)

    mockRequests && this.mockRequets()
  }

  public static async wait(ms: number) {
    await wait(ms)
  }

  public static async pause() {
    await jestPlaywright.debug()
  }

  public static async build(
    page: Page,
    options: IOptions
  ): Promise<DashboardPage> {
    // Async setup
    options.interceptTraffic && (await interceptTraffic(page))

    return new DashboardPage(page, options)
  }

  public async navigate() {
    await this.page.goto(`${process.env.REACT_APP_CLIENT_BASE_URL!}/dashboard`)
  }

  public async search(text: string) {
    return this.page.$(`text="${text}"`)
  }

  public async searchRegex(text: RegExp) {
    return this.page.$(`text=${text}`)
  }

  public async openFileInEditor(path: string[]) {
    for (const node of path) {
      await this.page.click(`text="${node}"`)
    }
  }

  public async openAvatarMenuAndClickOption(option: string) {
    await this.page.click('img[alt="avatar"]')

    await this.page.click(`text="${option}"`)

    await this.page.click(
      "//div[starts-with(normalize-space(.), 'FontDefaultSerifMonoThemeLight modeFull widthLarge textstyle checkSpellingReadab')]/div"
    )
  }

  public async clickDropdownItem(text: string) {
    await this.page.click(`text="${text}"`)
  }

  public async typeInTextArea(text: string) {
    await this.page.click('pre[role="presentation"]')

    await this.page.fill(
      "//div[normalize-space(.)='xxxxxxxxxx Some more mock content​']/div[1]/textarea",
      text
    )
  }

  public async openWidget(text: string) {
    await this.page.click(`text="${text}"`)
  }

  private debugRequests(page: Page) {
    page.on('request', (request) =>
      console.log('>>', request.method(), request.url())
    )
  }

  private surfaceConsoleLogs(page: Page) {
    page.on('console', (m) => console.log(m.text()))
  }

  private mockRequets() {
    nock(process.env.REACT_APP_SERVER_BASE_URL!, { allowUnmocked: true })
      .intercept('/graphql', 'OPTIONS')
      .reply(200)
      .post('/graphql', /"operationName":"Login"/gi)
      .reply(200, {
        data: {
          login: 'MOCK_JWT',
        },
      })
      .post('/graphql', /"operationName":"ReadRepo"/gi)
      .reply(200, {
        data: {
          readRepo: {
            name: 'MOCK.REPO',
            description: null,
            private: true,
            __typename: 'Repo',
          },
        },
      })
      .post('/graphql', /"operationName":"ReadGithubUser"/gi)
      .reply(200, {
        data: {
          readGithubUser: {
            id: 'MOCK_ID',
            login: 'MOCK_LOGIN',
            avatar_url: 'https://avatars3.githubusercontent.com/u/2397365?v=4',
            html_url: 'https://github.com/Sound1ab',
            name: 'MOCK NAME',
            __typename: 'GithubUser',
          },
        },
      })
    // .get(
    //   '/proxy/github.com/Sound1ab/Notes.git/info/refs?service=git-upload-pack'
    // )
    // .reply(
    //   200,
    //   '001e# service=git-upload-pack\n00000154aa5ac8085113aab828ceca16bfdaff84aa4effa6 HEAD\u0000multi_ack thin-pack side-band side-band-64k ofs-delta shallow deepen-since deepen-not deepen-relative no-progress include-tag multi_ack_detailed allow-tip-sha1-in-want allow-reachable-sha1-in-want no-done symref=HEAD:refs/heads/main filter object-format=sha1 agent=git/github-g130df6403707\n003daa5ac8085113aab828ceca16bfdaff84aa4effa6 refs/heads/main\n0000',
    //   {
    //     'Content-Type': 'application/x-git-upload-pack-advertisement',
    //     'Transfer-Encoding': 'chunked',
    //   }
    // )
    // .post('/proxy/github.com/Sound1ab/Notes.git/git-upload-pack')
    // .reply(
    //   200,
    //   '303030384e414b0a3030323402456e756d65726174696e67206f626a656374733a2031312c20646f6e652e0a3030356602436f756e74696e67206f626a656374733a20202039252028312f3131290d436f756e74696e67206f626a656374733a20203138252028322f3131290d436f756e74696e67206f626a656374733a20203237252028332f3131290d3030323302436f756e74696e67206f626a656374733a20203336252028342f3131290d3030323302436f756e74696e67206f626a656374733a20203435252028352f3131290d3030323302436f756e74696e67206f626a656374733a20203534252028362f3131290d3030323302436f756e74696e67206f626a656374733a20203633252028372f3131290d3030323302436f756e74696e67206f626a656374733a20203732252028382f3131290d3030323302436f756e74696e67206f626a656374733a20203831252028392f3131290d3030323402436f756e74696e67206f626a656374733a2020393025202831302f3131290d3030323402436f756e74696e67206f626a656374733a2031303025202831312f3131290d3030326202436f756e74696e67206f626a656374733a2031303025202831312f3131292c20646f6e652e0a3030323502436f6d7072657373696e67206f626a656374733a20203136252028312f36290d3030323502436f6d7072657373696e67206f626a656374733a20203333252028322f36290d3030323502436f6d7072657373696e67206f626a656374733a20203530252028332f36290d3030323502436f6d7072657373696e67206f626a656374733a20203636252028342f36290d3030323502436f6d7072657373696e67206f626a656374733a20203833252028352f36290d3030323502436f6d7072657373696e67206f626a656374733a20313030252028362f36290d3030326302436f6d7072657373696e67206f626a656374733a20313030252028362f36292c20646f6e652e0a30613066015041434b000000020000000b9c2c789c7591c972a3300044ef7c85eeae04c42654954c050cc178613126f6e426b06cc0984508b0f3f5e349ae33efd65df5fad29c510a8e1a365272520996a16a40926245d625a2a448239a428f5049b19e69a9d012466b0e0c1d1b8692ea998c53420d226b0a9124a4224382278ad38788309565810c3c6f1808f3a2aa8a1684845d28032fed4f7e6abff35b33f0aa692ecf5973fd05a00e255d45184330931e088ff65a70fef0dc822f8614bcd40da36d757f3b173c1fd2ff68e7f6dc1767f0f417cb713d1f846e0862cff5cd5db275be7b010860eaadcc324d6b6e9a91152dcfa67755e65b6b85f2520d46857993691e179e672e47a7d9e79fca246e373c1e077b83e5e3a914c071a5a06e94f355339e4ca6e08f13bad0b2b24a06d3fc22eb1c478e581ebf52bde4819df8e8e3daacc31a23d357a25e0c04e0907b992ccacffcabe753274a629f5d43694ba2f9146761544e418692855bba01dc2deda43250200ee12caa6dd365c57afd58f0f83ddea54cdb77a378ab14b7e8e4cf22f820092e556766ad57dc6ac502b1a0d84fcaa1efeea976df1c66e344eefd3b1904b0dea807a8d5cb4596e68e7f72ed45e474cc915a71cbec0cfa9e48b8a8b1763f05cce8c2e6700bfde132e86d37cb860b460298eb78733ec4b44d10d43c73d4cbf106abfdd7329ad4e1d6baf072b3cd6bb18bdfa725a9f335747ef76217bb512125672b7915c06b34af4fc2cf678e6ffffb3161ce28e1145474a4d56e6ade8b8a06357dbe1eff007ba5de369e2c789c7591cb72a2400045f77c45efad0cef06aa92a9340a8812045fd1ec6868a00501a101f1ebc749b63377774ed5bd9bcb5a42402ca6b196c2449253312112d45281c05853a128ca86a669ba8c15180b3ad7442da918805224aa8616cb584d051dcb4422a22ea52ac158d10c036b02168d54c15cd4b3bc6e4190d3b2a40d08a2b6202d786d7ef8a5f9e6f7ba67655d17bfe2fafa1b885014e07305ea60263cc33ded9532f6ec39942d7b0c5eabba254d39bd6794e53dfe4f2d6bb28e66e0e56f4ccb717d103801d8b98e8ff687adf5ed39c081b133631321738e506886ab0cb9d76cbe35d75a7e513683dcba2342c9d27591751a940dcf3e1e6bef2ea749d20919bcd80d07dc72309c334da3d84ab3a23068eca9d2f6a48c0ed16be97021fc56e26feab98acd21f72e63b823741df58377fcf2564ec2738009d9c39cca85b7ee3c933e26d9b543e54cfb2132f7d27571528e49a3cf4766e9678a90b373d68b2ada2c0e0ce5ead7d9a41c48dca3f3f9d00afc21e60f2347ae96ada7e262ce7cbb29bc4191d565d54cbc257ea9373f60f353403b7ef2f312e25eb91eef1cd8caec1612b4547dcce68993b7f364c6e785c56c112207ed87fd6c4c6f877c68945d684b017f55a9d0c52b730927ac57210724fb20dcb481cf6197eef9fbda3602728b8fb7a57c9f9c30a8bcf366df76471e8f1f95c5d46db4829f875d68c55262b6eee18d036ffec392b89fcf2c7ff1efc7b805290923a0240329f7636dd76542da4d457e5d933fbf4ade5c9e2c789c7591cb72a2400045f77c45efad8c3c9a5755321540410c42231a8dbb069a87b680d020f8f5e324db99bb3ba7ea6eee652d2140905441c430158558c6baae6abc26a4ba2ec73016133d553381d7312ff35c835b5231a0684aac419862a2896a1c4b72aa4b444c940c8a52aca90a9f499a1463c8e19e15750b5051525a3600e1f6425af0dafcf04bf3cdef75cf685d5f7e25f5f53710148157a0aa4311ccf867b8a7bd968c3d7b4ec9567d0c5eabba250d9ddef392157dfc9f5adee45d998397bf31978eeb03e42010b98e6fecf6dbe5b7e70007ee9d999886615a86119ae13a37dcab636dcd0fb538c360905af76e18e9ca750d733e8eea4c178bb5e83476752a4f0863d9e440edb4d3814e215bdb9fe96e24fe7aeb2e3a2782f507ea2d3f231322f9e2ae12f240c19814f3470679714feb996029c740e6c0c6de2bc2168fd139182ee8b9eaad7a501bafb393ef9593fc0987e330fafafc68197b81ff62e8dcf1376b68dc51ab56d9f0c581c04efcd849cc0a9d3f435b8b8db1dc23212bb0280dd18ec2a8db4e27092dfb43e119b4d98665b1356b57d3cd7112edc38303e22d7131f2f4b92ae5511ff02aed6a16aa848ea7f95758c5aba6aaabae95fad5655313a13f649b8f18526d7128667b622e38e0e5881d8e2d6f4869074f2ee42d1f21f5c84fd93ccd642fb9a2b6bc79d1ae215769c4cc0ff032163ce1bef4ee11796cde38f086d899723f9f2dfdc5bf1fe3ac966046002503a1bb7b6dd734256d50915fd7f40f787bdf349c29789c75914b73a2400084effc8ab95b893c7490aa642b83107928a04030de64181e3a38380ea2f9f57193eb6e5fbafaabeabeb4e08400ac94582f61a16aa5521015eaa54c20d6a750513443d7f599964f209667d2be1735e320aa1b4a9b0e447b7e241cbc74bff9a9fbc96fac1794b1e33366ed1fa040458613dd506430921f921eb46d8478f4168d70fa1cbc9c18271dbdbf558da8fbfc3fb5aaab2e4d059efecab4176e00a24504627711a024ddd83f5c0212182e26361132e708adcdb5572197b6f38de9ebf561125e35ee0e08158eeb2284a6a4c88283b5e1b925b07f5171123aa6049cc99d0ebb1e5f3da3cf179f861eedbd75a019aab6aa515252cba16cfc31ea0eb3bdbdff0abd9b11851d346be4ddd14e3efa1248a3f345a87ed8221ab1f77c198cac5b94c70e81a8c9f471b5cbbab25f38219e251f0721e78772e08a362aaa4dcf084d13099cf2aa66f62a2a46e7ebfb6cbcfcb24e303687c40f565f4c1730d996f1cd5f2a7ed96c4b1607cbc4833dc69a5ffb06ac3b2e81c83957d967be4e9c6c6328065d6ed50e1fd7bb7a32776488c629c61b9fde654c33e6786738b72f491be4a95fb7c2eb389500b6b7e9e4929c1e7b68c6565e1cef84e1b97d28dca91ca00a6b3cdf2287aeb2b92a5b294d5cdfc8b06367b7e970aa865709bc2adcaba5dfcfecc0faf763d29c93bd2080922ba1e189bc37943cecb92dbe01388dcfa8aa05789c33343030333151c8492d4bcdf1cf4b75cbcc4905527ab9290c2f5455170bfef7fae9a62e7f7b7d8fd0d3b75f4eda9918000142717e4e4a6a1190c170f4e3b73f77ef66daf7464fcfb6a87f116ea21d760b0031132619b201789c0bcecf4d55c8cd4fce5648cecf2b49cd2be102003ed70684ae02789c33343030333151c8492d4bcd0929cf77cbcc49f5cf4bd5cb4d61888f4cc82f31b9fbeaec6cd9ef8fd213d61ed071bb0e007b8a1314b701789c0bcecf4d55c8cd2f0211c9d90ac9f97925a979255c0065340857ae02789c33343030333151c8492d4bcdf1cf4b75cbcc4905527ab9290c2f5455170bfef7fae9a62e7f7b7d8fd0d3b75f4eda010072fb12d4e9018105789c8b8a9ae0265231fd4dbfb1ff8cd8699baabc3df87265bcbd3ee60100899c0a80a003789c33343030333151c8492d4bcd0929cf77cbcf49492df2cf4bd5cb4d61888f4cc82f31b9fbeaec6cd9ef8fd213d61ed071bb0e00a05913f0238a5c29e821cfc0bda6dc0babdc47ccf451da3030303601333030336202546f74616c203131202864656c74612031292c207265757365642030202864656c74612030292c207061636b2d72657573656420300a30303030',
    //   {
    //     'Content-Type': 'application/x-git-upload-pack-result',
    //     'Transfer-Encoding': 'chunked',
    //   }
    // )
  }
}
