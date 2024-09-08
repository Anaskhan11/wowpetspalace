import React, { useState, useEffect } from "react";
import TopbarShops from "./TopbarShops";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditShop = () => {
  const [tabName, setTabName] = useState("Shop Information");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [shopTags, setShopTags] = useState([]);
  const [phone3, setPhone3] = useState("");
  const [statusForPublish, setStatusForPublish] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [shopCoverPhoto, setShopCoverPhoto] = useState(null);
  const [shopIconPhoto, setShopIconPhoto] = useState(null);
  const [aboutWebsiteLink, setAboutWebsiteLink] = useState("");
  const [facebook, setFacebook] = useState("");
  const [google, setGoogle] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [pinterest, setPinterest] = useState("");
  const [twitter, setTwitter] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [messenger, setMessenger] = useState("");

  // Payment settings states
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [isEnabledStripe, setIsEnabledStripe] = useState(false);
  const [paypalEnvironment, setPaypalEnvironment] = useState("");
  const [paypalMerchantId, setPaypalMerchantId] = useState("");
  const [paypalPublicKey, setPaypalPublicKey] = useState("");
  const [paypalPrivateKey, setPaypalPrivateKey] = useState("");
  const [isEnabledPaypal, setIsEnabledPaypal] = useState(false);
  const [bankAccount, setBankAccount] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [isEnabledBankTransfer, setIsEnabledBankTransfer] = useState(false);
  const [codEmail, setCodEmail] = useState("");
  const [isEnabledCod, setIsEnabledCod] = useState(false);
  const [razorKey, setRazorKey] = useState("");
  const [isEnabledRazor, setIsEnabledRazor] = useState(false);

  // Currency settings states
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [currencyShortForm, setCurrencyShortForm] = useState("");

  // Email settings states
  const [emailAccount, setEmailAccount] = useState("");

  // Tax settings states
  const [overallTax, setOverallTax] = useState("");
  const [shippingTax, setShippingTax] = useState("");

  // Policy & Terms settings states
  const [refundPolicy, setRefundPolicy] = useState("");
  const [termsLabel, setTermsLabel] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");

  // Shipping settings states
  const [standardShippingEnable, setStandardShippingEnable] = useState(false);
  const [zoneShippingEnable, setZoneShippingEnable] = useState(false);
  const [noShippingEnable, setNoShippingEnable] = useState(false);

  const [showTags, setShowTags] = useState([]);

  const { id } = useParams();
  useEffect(() => {
    const fetchTags = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/shop/shopTags`
      );

      console.log("check tag response ", response.data);
      setShowTags(response.data);
    };
    fetchTags();
  }, []);
  const handleTagChange = (event) => {
    const selectedTag = event.target.value;

    setShopTags((prevTags) => [...prevTags, selectedTag]);
  };

  const handleTagRemove = (index) => {
    setShopTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchShopByid = async () => {
      console.log(id);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/shop/getshop/${id}`
      );
      const shop = res.data.result[0];
      console.log("checkin response by id", shop);
      setName(shop.name);
      setDescription(shop.description);
      setEmail(shop.email);
      setPhone1(shop.about_phone1);
      setPhone2(shop.about_phone2);
      setPhone3(shop.about_phone3);
      setStatusForPublish(shop.statusForPublish);
      setIsFeatured(shop.is_featured);
      setAddress1(shop.address1);
      setAddress2(shop.address2);
      setAboutWebsiteLink(shop.about_website);
      setFacebook(shop.facebook);
      setGoogle(shop.google_plus);
      setInstagram(shop.instagram);
      setYoutube(shop.youtube);
      setPinterest(shop.pinterest);
      setTwitter(shop.twitter);
      setWhatsappNumber(shop.whatsapp_no);
      setMessenger(shop.messenger);
      setShopTags(shop.shopTags);
      setStripePublishableKey(shop.stripe_publishable_key);
      setStripeSecretKey(shop.stripe_secret_key);
      setIsEnabledStripe(shop.stripe_enabled);
      setPaypalEnvironment(shop.paypal_environment);
      setPaypalMerchantId(shop.paypal_merchant_id);
      setPaypalPublicKey(shop.paypal_public_key);
      setPaypalPrivateKey(shop.paypal_private_key);
      setIsEnabledPaypal(shop.isEnabledPaypal);
      setBankAccount(shop.bank_account);
      setBankName(shop.bank_name);
      setBankCode(shop.bank_code);
      setBranchCode(shop.branch_code);
      setSwiftCode(shop.swift_code);
      setIsEnabledBankTransfer(shop.banktransfer_enabled);
      setCodEmail(shop.cod_email);
      setIsEnabledCod(shop.cod_enabled);
      setRazorKey(shop.razor_key);
      setIsEnabledRazor(shop.razor_enabled);
      setCurrencySymbol(shop.currency_symbol);
      setCurrencyShortForm(shop.currency_short_form);
      setEmailAccount(shop.sender_email);
      setOverallTax(shop.overall_tax_value);
      setShippingTax(shop.shipping_tax_value);
      setRefundPolicy(shop.refund_policy);
      setTermsLabel(shop.terms);
      setPrivacyPolicy(shop.privacy_policy);
      setStandardShippingEnable(shop.standard_shipping_enable);
      setZoneShippingEnable(shop.zone_shipping_enable);
      setNoShippingEnable(shop.no_shipping_enable);
    };
    fetchShopByid();
  }, []);

  const handleEditChange = (event) => {
    event.preventDefault();
  };

  return (
    <div className="container mx-auto mt-32 bg-white p-4 rounded-md">
      <TopbarShops setTabName={setTabName} tabName={tabName} />

      <form onSubmit={() => console.log("submitted")}>
        {tabName === "Shop Information" && (
          <div className="mt-4 ml-4">
            <h1 className="text-xl font-semibold mb-4">Shop Information</h1>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone 1 (Default)
                </label>
                <input
                  type="text"
                  name="phone1"
                  value={phone1}
                  onChange={(e) => setPhone1(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone 2
                </label>
                <input
                  type="text"
                  name="phone2"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shop Tags
                </label>
                <select
                  name="shopTags"
                  onChange={handleTagChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select a tag</option>
                  {showTags &&
                    showTags.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                </select>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Selected Tags
                  </label>
                  <ul className="selected-tags pl-5">
                    {shopTags &&
                      shopTags.map((tagId, index) => {
                        const tag = showTags.find(
                          (t) => t.id === Number(tagId)
                        );
                        return (
                          <li
                            key={index}
                            className="selected-tag inline-flex items-center bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded"
                          >
                            {tag?.name}
                            <button
                              onClick={() => handleTagRemove(index)}
                              className="remove-tag-btn ml-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 fill-current"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-2.293-9.707a1 1 0 1 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 1 1 1.414 1.414L11.414 10l2.293 2.293a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 1 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 1 1 1.414-1.414L10 8.586z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone 3
                </label>
                <input
                  type="text"
                  name="phone3"
                  value={phone3}
                  onChange={(e) => setPhone3(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="col-span-1 flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="statusForPublish"
                    checked={statusForPublish}
                    onChange={(e) => setStatusForPublish(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm font-medium text-gray-700">
                    Status For Publish
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 block text-sm font-medium text-gray-700">
                    Is Featured?
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Address 1
                </label>
                <textarea
                  name="address1"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Address 2
                </label>
                <textarea
                  name="address2"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shop Cover Photo
                </label>
                <input
                  type="file"
                  name="shopCoverPhoto"
                  onChange={(e) => setShopCoverPhoto(e.target.files[0])}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shop Icon Photo
                </label>
                <input
                  type="file"
                  name="shopIconPhoto"
                  onChange={(e) => setShopIconPhoto(e.target.files[0])}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  About Website Link
                </label>
                <input
                  type="text"
                  name="aboutWebsiteLink"
                  value={aboutWebsiteLink}
                  onChange={(e) => setAboutWebsiteLink(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="col-span-2 mt-6">
                <h2 className="text-lg font-semibold">Social Information</h2>
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Facebook
                    </label>
                    <input
                      type="text"
                      name="facebook"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Google
                    </label>
                    <input
                      type="text"
                      name="google"
                      value={google}
                      onChange={(e) => setGoogle(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Instagram
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      YouTube
                    </label>
                    <input
                      type="text"
                      name="youtube"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pinterest
                    </label>
                    <input
                      type="text"
                      name="pinterest"
                      value={pinterest}
                      onChange={(e) => setPinterest(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Twitter
                    </label>
                    <input
                      type="text"
                      name="twitter"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-2 mt-6">
                <h2 className="text-lg font-semibold">Chat Information</h2>
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      name="whatsappNumber"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Messenger
                    </label>
                    <input
                      type="text"
                      name="messenger"
                      value={messenger}
                      onChange={(e) => setMessenger(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTabName("Payment Setting")}
                  className="px-10 py-2 rounded-md bg-blue-500 text-white"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
        {/* ============================================================= */}
        {/* ====================payment Setting========================== */}
        {/* ============================================================= */}
        {tabName === "Payment Setting" && (
          <div className="mt-4 ml-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Setting</h2>

              {/* Stripe Payment Settings */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  [Option 1] : Payment With Stripe
                </h3>
                <label className="block mb-2">
                  <span className="text-gray-700">Publishable Key</span>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Publishable Key"
                    value={stripePublishableKey}
                    onChange={(e) => setStripePublishableKey(e.target.value)}
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Secret Key</span>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Secret Key"
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                  />
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={isEnabledStripe}
                    onChange={(e) => setIsEnabledStripe(e.target.checked)}
                  />
                  <span className="ml-2">Is Enabled Stripe Payment?</span>
                </label>
              </div>

              {/* PayPal Payment Settings */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  [Option 2] : Payment With Paypal Enabled
                </h3>
                <label className="block mb-2">
                  <span className="text-gray-700">Paypal Environment</span>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Paypal Environment"
                    value={paypalEnvironment}
                    onChange={(e) => setPaypalEnvironment(e.target.value)}
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Paypal Merchant ID</span>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Paypal Merchant ID"
                    value={paypalMerchantId}
                    onChange={(e) => setPaypalMerchantId(e.target.value)}
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Paypal Public Key</span>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Paypal Public Key"
                    value={paypalPublicKey}
                    onChange={(e) => setPaypalPublicKey(e.target.value)}
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Paypal Private Key</span>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Paypal Private Key"
                    value={paypalPrivateKey}
                    onChange={(e) => setPaypalPrivateKey(e.target.value)}
                  />
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={isEnabledPaypal}
                    onChange={(e) => setIsEnabledPaypal(e.target.checked)}
                  />
                  <span className="ml-2">Is Paypal Enabled?</span>
                </label>
              </div>

              {/* Bank Transfer Settings */}
              <div>
                <h3 className="text-lg font-medium mb-2">Bank Transfer</h3>
                <label className="block mb-2">
                  <span className="text-gray-700">Bank Account</span>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Bank Account"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Bank Name</span>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Bank Code</span>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Bank Code"
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Branch Code</span>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Branch Code"
                    value={branchCode}
                    onChange={(e) => setBranchCode(e.target.value)}
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Swift Code</span>
                  <input
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Swift Code"
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                  />
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={isEnabledBankTransfer}
                    onChange={(e) => setIsEnabledBankTransfer(e.target.checked)}
                  />
                  <span className="ml-2">Is Enabled Bank Transfer?</span>
                </label>
              </div>
              <div className="p-1">
                <div className="mb-6">
                  <h4 className="font-bold mb-3">
                    [Option 4]: Payment With Cash On Delivery
                  </h4>
                  <label htmlFor="codEmail" className="block font-medium">
                    COD Confirmation Email
                  </label>
                  <input
                    id="codEmail"
                    type="text"
                    placeholder="COD Confirmation Email"
                    className="mt-1 p-2 border rounded w-full"
                    value={codEmail}
                    onChange={(e) => setCodEmail(e.target.value)}
                  />
                  <div className="mt-3">
                    <input
                      id="codEnabled"
                      type="checkbox"
                      className="align-middle"
                      checked={isEnabledCod}
                      onChange={(e) => setIsEnabledCod(e.target.checked)}
                    />
                    <label htmlFor="codEnabled" className="ml-2">
                      Is Enabled Cash On Delivery?
                    </label>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-bold mb-3">
                    [Option 5]: Payment With Razor
                  </h4>
                  <label htmlFor="razorKey" className="block font.bold">
                    Razor Key
                  </label>
                  <input
                    id="razorKey"
                    type="text"
                    placeholder="Razor Key"
                    className="mt-1 p-2 border rounded w-full"
                    value={razorKey}
                    onChange={(e) => setRazorKey(e.target.value)}
                  />
                  <div className="mt-3">
                    <input
                      id="razorEnabled"
                      type="checkbox"
                      className="align-middle"
                      checked={isEnabledRazor}
                      onChange={(e) => setIsEnabledRazor(e.target.checked)}
                    />
                    <label htmlFor="razorEnabled" className="ml-2">
                      Is Enabled Razor?
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTabName("Shop Information")}
                className="px-10 py-2 rounded-md bg-slate-50 border border-slate-400"
              >
                Previous
              </button>
              <button
                onClick={() => setTabName("Currency Setting")}
                className="px-10 py-2 rounded-md bg-blue-500 text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {/* ============================================================= */}
        {/* ====================Currency Setting========================== */}
        {/* ============================================================= */}
        {tabName === "Currency Setting" && (
          <div className="mt-4 ml-4">
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency Symbol (e.g., $)
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-500 rounded-md p-2"
                placeholder="Currency Symbol"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
              />
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
                Currency Short Form (e.g., USD)
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-500 rounded-md p-2"
                placeholder="Currency Short Form"
                value={currencyShortForm}
                onChange={(e) => setCurrencyShortForm(e.target.value)}
              />
            </div>
            {/* Buttons */}
            <div className="flex items-center gap-4 mt-10">
              <button
                onClick={() => setTabName("Payment Setting")}
                className="px-10 py-2 rounded-md bg-slate-50 border border-slate-400"
              >
                Previous
              </button>
              <button
                onClick={() => setTabName("Sending Email Setting(For SMTP)")}
                className="px-10 py-2 rounded-md bg-blue-500 text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* ======================Sending Email Setting================== */}
        {/* ============================================================= */}
        {tabName === "Sending Email Setting(For SMTP)" && (
          <div className="mt-4 ml-4">
            <div className="mt-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="emailAccount"
              >
                Sender Email Account (For SMTP)
              </label>
              <input
                type="text"
                id="emailAccount"
                placeholder="Sender Email"
                className="mt-1 block w-full border border-gray-500 rounded-md p-2"
                value={emailAccount}
                onChange={(e) => setEmailAccount(e.target.value)}
              />
            </div>
            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-10">
              <button
                onClick={() => setTabName("Currency Setting")}
                className="px-10 py-2 rounded-md bg-slate-50 border border-slate-400"
              >
                Previous
              </button>
              <button
                onClick={() => setTabName("Tax")}
                className="px-10 py-2 rounded-md bg-blue-500 text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* ====================Tax Setting========================== */}
        {/* ============================================================= */}
        {tabName === "Tax" && (
          <div className="mt-4 ml-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Overall Tax (%)
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Overall Tax (%)"
                  value={overallTax}
                  onChange={(e) => setOverallTax(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Shipping Tax (%)
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Shipping Tax (%)"
                  value={shippingTax}
                  onChange={(e) => setShippingTax(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-10">
              <button
                onClick={() => setTabName("Sending Email Setting(For SMTP)")}
                className="px-10 py-2 rounded-md bg-slate-50 border border-slate-400"
              >
                Previous
              </button>
              <button
                onClick={() => setTabName("Policy & Terms")}
                className="px-10 py-2 rounded-md bg-blue-500 text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {/* ============================================================= */}
        {/* ====================Plicy And Terms Setting========================== */}
        {/* ============================================================= */}
        {tabName === "Policy & Terms" && (
          <div className="mt-4 ml-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Refund Policy
                </label>
                <textarea
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Refund Policy"
                  rows="5"
                  value={refundPolicy}
                  onChange={(e) => setRefundPolicy(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  terms_label
                </label>
                <textarea
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="terms_label"
                  rows="5"
                  value={termsLabel}
                  onChange={(e) => setTermsLabel(e.target.value)}
                ></textarea>
              </div>
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Privacy Policy
                </label>
                <textarea
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Privacy Policy"
                  rows="5"
                  value={privacyPolicy}
                  onChange={(e) => setPrivacyPolicy(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-10">
              <button
                onClick={() => setTabName("Tax")}
                className="px-10 py-2 rounded-md bg-slate-50 border border-slate-400"
              >
                Previous
              </button>
              <button
                onClick={() => setTabName("Shipping Method")}
                className="px-10 py-2 rounded-md bg-blue-500 text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {/* ============================================================= */}
        {/* ====================Shipping Method ========================== */}
        {/* ============================================================= */}
        {tabName === "Shipping Method" && (
          <div className="mt-4 ml-4">
            <div className="flex justify-between gap-10 sm:pr-20">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shipping"
                  value={standardShippingEnable}
                  className="accent-blue-500"
                  onChange={(e) =>
                    setStandardShippingEnable({
                      standard_shipping_enable: e.target.checked
                        ? "standard"
                        : "",
                    })
                  }
                />
                <span>Standard Shipping Enabled</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shipping"
                  value={zoneShippingEnable}
                  className="accent-blue-500"
                  onChange={(e) =>
                    setZoneShippingEnable({
                      zone_shipping_enable: e.target.checked ? "zone" : "",
                    })
                  }
                />
                <span>Zone Shipping Enable</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shipping"
                  className="accent-blue-500"
                  value={noShippingEnable}
                  onChange={(e) =>
                    setNoShippingEnable({
                      no_shipping_enable: e.target.checked ? "none" : "",
                    })
                  }
                />
                <span>No Shipping Enable</span>
              </label>
            </div>
            <div className="flex items-center gap-4 mt-10">
              <button
                onClick={() => setTabName("Policy & Terms")}
                className="px-10 py-2 rounded-md bg-slate-50 border border-slate-400"
              >
                Previous
              </button>
              <button
                onClick={handleEditChange}
                className="px-10 py-2 rounded-md bg-blue-500 text-white"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditShop;
